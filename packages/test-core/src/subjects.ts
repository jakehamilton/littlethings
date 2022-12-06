import type { TestAPI } from "./types";

export class Describe {
	type = "Describe" as const;

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
	}: {
		context: Array<string>;
		body: (api: TestAPI) => void | Promise<void>;
		rootDescribe?: Describe;
	}) {
		this.context = context;
		this.body = body;
		this.rootDescribe = rootDescribe || this;

		this.api = {
			describe: (description, body) => {
				const child = new Describe({
					context: this.context.concat(description),
					body,
					rootDescribe: this.rootDescribe,
				});
				child.parent = this;
				this.children.push(child);
			},
			it: (description, body) => {
				const child = new Test({
					context: this.context.concat(description),
					body,
				});
				child.parent = this;
				this.children.push(child);
			},
			beforeEach: (body) => {
				this.beforeEaches.push(
					new LifecycleHook({
						context: this.context.concat(
							`beforeEach #${this.beforeEaches.length + 1}`
						),
						body,
					})
				);
			},
			beforeAll: (body) => {
				this.rootDescribe.beforeAlls.push(
					new LifecycleHook({
						context: this.context.concat(
							`beforeAll #${
								this.rootDescribe.beforeAlls.length + 1
							}`
						),
						body,
					})
				);
			},
			afterEach: (body) => {
				this.afterEaches.push(
					new LifecycleHook({
						context: this.context.concat(
							`afterEach #${this.afterEaches.length + 1}`
						),
						body,
					})
				);
			},
			afterAll: (body) => {
				this.rootDescribe.afterAlls.push(
					new LifecycleHook({
						context: this.context.concat(
							`afterAll #${
								this.rootDescribe.afterAlls.length + 1
							}`
						),
						body,
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

	context: Array<string>;
	body: () => void | Promise<void>;
	parent: Describe | null = null;

	constructor({
		context,
		body,
	}: {
		context: Array<string>;
		body: () => void | Promise<void>;
	}) {
		this.context = context;
		this.body = body;
	}
}

export class Test {
	type = "Test" as const;

	context: Array<string>;
	body: () => void | Promise<void>;
	parent: Describe | null = null;

	constructor({
		context,
		body,
	}: {
		context: Array<string>;
		body: () => void | Promise<void>;
	}) {
		this.context = context;
		this.body = body;
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
