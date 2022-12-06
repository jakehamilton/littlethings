import type { TestAPI } from "./types";

export class Describe {
	type = "Describe" as const;

	flags: Set<string>;
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
		this.flags = new Set(flags || []);

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
						flags,
					})
				);
			},
		};
	}

	runBody() {
		return this.body(this.api);
	}
}

export class LifecycleHook {
	type = "LifecycleHook" as const;

	flags: Set<string>;
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
		this.flags = new Set(flags || []);
	}
}

export class Test {
	type = "Test" as const;

	flags: Set<string>;
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
		this.flags = new Set(flags || []);
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
}
