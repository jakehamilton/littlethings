type TestAPI = {
	describe: (
		description: string,
		body: (api: TestAPI) => void | Promise<void>
	) => void;
	it: (description: string, body: () => void | Promise<void>) => void;
	beforeEach: (body: () => void | Promise<void>) => void;
	beforeAll: (body: () => void | Promise<void>) => void;
	afterEach: (body: () => void | Promise<void>) => void;
	afterAll: (body: () => void | Promise<void>) => void;
};

type RunMode = "NORMAL" | "IGNORED" | "FOCUSED";

class Test {
	type = "Test" as const;

	context: Array<string>;
	body: () => void | Promise<void>;
	runMode: RunMode;
	parent: Describe | null = null;

	constructor({
		context,
		runMode = "NORMAL",
		body,
	}: {
		context: Array<string>;
		runMode?: RunMode;
		body: () => void | Promise<void>;
	}) {
		this.context = context;
		this.runMode = runMode;
		this.body = body;
	}
}

class Describe {
	type = "Describe" as const;

	context: Array<string>;
	runMode: RunMode;
	body: (api: TestAPI) => void | Promise<void>;
	parent: Describe | null = null;

	rootDescribe: Describe;

	children: Array<Test | Describe> = [];
	befores: Array<LifecycleHook> = [];
	afters: Array<LifecycleHook> = [];

	api: TestAPI;

	hasRunBody: boolean = false;

	constructor({
		context,
		runMode = "NORMAL",
		body,
		rootDescribe,
	}: {
		context: Array<string>;
		runMode?: RunMode;
		body: (api: TestAPI) => void | Promise<void>;
		rootDescribe?: Describe;
	}) {
		this.context = context;
		this.runMode = runMode;
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
				this.befores.push(
					new LifecycleHook({
						context: this.context.concat("beforeEach"),
						body,
					})
				);
			},
			beforeAll: (body) => {
				this.rootDescribe.befores.push(
					new LifecycleHook({
						context: this.context.concat("beforeAll"),
						body,
					})
				);
			},
			afterEach: (body) => {
				this.afters.push(
					new LifecycleHook({
						context: this.context.concat("afterEach"),
						body,
					})
				);
			},
			afterAll: (body) => {
				this.rootDescribe.afters.push(
					new LifecycleHook({
						context: this.context.concat("afterAll"),
						body,
					})
				);
			},
		};
	}

	runBody() {
		if (this.hasRunBody) return;

		this.body(this.api);
		for (const child of this.children) {
			if (child.type === "Describe") {
				child.runBody();
			}
		}
	}
}

class LifecycleHook {
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

type TestEvent =
	| {
			type: "started";
			subject: Test | Describe | LifecycleHook;
	  }
	| {
			type: "result";
			subject: Test | Describe | LifecycleHook;
			status: "PASSED" | "FAILED" | "SKIPPED" | "ERRORED";
	  };

class TestSuite {
	rootDescribe: Describe;
	api: TestAPI;

	constructor() {
		this.rootDescribe = new Describe({
			context: [],
			body: () => {},
		});
		this.api = this.rootDescribe.api;
	}

	run({
		onResult = () => {},
	}: {
		onResult?: (result: TestResult) => void;
	}): Promise<Array<TestResult>> {
		this.rootDescribe.runBody();

		const results: Array<TestResult> = [];
		const workToDo: Array<() => void | Promise<void>> = [];

		function prepareWork(describe: Describe) {
			for (const child of describe.children) {
				if (child.type === "Test") {
					workToDo.push(async () => {
						for (const before of describe.befores) {
							workToDo.push(() => before.body());
						}
					});
				}
			}
		}

		return results;
	}
}
