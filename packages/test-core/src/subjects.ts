import type { TestAPI } from "./types";

// "Info" objects must be JSON-serializable

export type Subject = Describe | LifecycleHook | Test;
export type SubjectInfo = DescribeInfo | LifecycleHookInfo | TestInfo;

export interface DescribeInfo {
	type: "Describe";
	flags: Array<string>;
	context: Array<string>;
}

export class Describe {
	type = "Describe" as const;

	flags: Array<string>;
	context: Array<string>;
	body: (api: TestAPI) => void | Promise<void>;
	parent: Describe | null = null;

	rootDescribe: Describe;

	children: Array<Test | Describe> = [];
	beforeEaches: Array<LifecycleHook> = [];
	beforeAlls: Array<LifecycleHook> = [];
	afterEaches: Array<LifecycleHook> = [];
	afterAlls: Array<LifecycleHook> = [];

	api: TestAPI;

	constructor({
		context,
		body,
		rootDescribe,
		flags,
	}: {
		context: Array<string>;
		body: (api: TestAPI) => void | Promise<void>;
		rootDescribe?: Describe;
		flags?: Iterable<string>;
	}) {
		this.context = context;
		this.body = body;
		this.rootDescribe = rootDescribe || this;
		this.flags = Array.from(flags || []);

		this.api = {
			describe: (description, body, flags) => {
				const child = new Describe({
					context: this.context.concat(description),
					body,
					flags,
					rootDescribe: this.rootDescribe,
				});
				child.parent = this;
				this.children.push(child);
			},
			it: (description, body, flags) => {
				const child = new Test({
					context: this.context.concat(description),
					body,
					flags,
				});
				child.parent = this;
				this.children.push(child);
			},
			beforeEach: (body, flags) => {
				this.beforeEaches.push(
					new LifecycleHook({
						context: this.context.concat(
							`beforeEach #${this.beforeEaches.length + 1}`
						),
						body,
						kind: "beforeEach",
						flags,
					})
				);
			},
			beforeAll: (body, flags) => {
				this.rootDescribe.beforeAlls.push(
					new LifecycleHook({
						context: this.context.concat(
							`beforeAll #${
								this.rootDescribe.beforeAlls.length + 1
							}`
						),
						body,
						kind: "beforeAll",
						flags,
					})
				);
			},
			afterEach: (body, flags) => {
				this.afterEaches.push(
					new LifecycleHook({
						context: this.context.concat(
							`afterEach #${this.afterEaches.length + 1}`
						),
						body,
						kind: "afterEach",
						flags,
					})
				);
			},
			afterAll: (body, flags) => {
				this.rootDescribe.afterAlls.push(
					new LifecycleHook({
						context: this.context.concat(
							`afterAll #${
								this.rootDescribe.afterAlls.length + 1
							}`
						),
						body,
						kind: "afterAll",
						flags,
					})
				);
			},
		};
	}

	toJSON(): DescribeInfo {
		const { type, flags, context } = this;
		return { type, flags, context };
	}

	runBody() {
		return this.body(this.api);
	}
}

export interface LifecycleHookInfo {
	type: "LifecycleHook";
	kind: "beforeEach" | "afterEach" | "beforeAll" | "afterAll";
	flags: Array<string>;
	context: Array<string>;
}

export class LifecycleHook {
	type = "LifecycleHook" as const;
	kind: "beforeEach" | "afterEach" | "beforeAll" | "afterAll";

	flags: Array<string>;
	context: Array<string>;
	body: () => void | Promise<void>;
	parent: Describe | null = null;

	constructor({
		context,
		body,
		kind,
		flags,
	}: {
		context: Array<string>;
		body: () => void | Promise<void>;
		kind: "beforeEach" | "afterEach" | "beforeAll" | "afterAll";
		flags?: Iterable<string>;
	}) {
		this.context = context;
		this.body = body;
		this.kind = kind;
		this.flags = Array.from(flags || []);
	}

	toJSON(): LifecycleHookInfo {
		const { type, kind, flags, context } = this;
		return { type, kind, flags, context };
	}
}

export interface TestInfo {
	type: "Test";
	flags: Array<string>;
	context: Array<string>;
}

export class Test {
	type = "Test" as const;

	flags: Array<string>;
	context: Array<string>;
	body: () => void | Promise<void>;
	parent: Describe | null = null;

	constructor({
		context,
		body,
		flags,
	}: {
		context: Array<string>;
		body: () => void | Promise<void>;
		flags?: Iterable<string>;
	}) {
		this.context = context;
		this.body = body;
		this.flags = Array.from(flags || []);
	}

	gatherBefores() {
		const ancestors: Array<Describe> = [];
		let currentParent = this.parent;
		while (currentParent != null) {
			ancestors.push(currentParent);
			currentParent = currentParent.parent;
		}
		ancestors.reverse();

		return ancestors.map((describe) => describe.beforeEaches).flat(1);
	}

	gatherAfters() {
		const ancestors: Array<Describe> = [];
		let currentParent = this.parent;
		while (currentParent != null) {
			ancestors.push(currentParent);
			currentParent = currentParent.parent;
		}

		return ancestors.map((describe) => describe.afterEaches).flat(1);
	}

	toJSON(): TestInfo {
		const { type, flags, context } = this;
		return { type, flags, context };
	}
}
