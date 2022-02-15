type TestAPI = {
	describe: (description: string, init: () => void | Promise<void>) => void;
	it: (description: string, init: () => void | Promise<void>) => void;
	beforeEach: (init: () => void | Promise<void>) => void;
	beforeAll: (init: () => void | Promise<void>) => void;
	afterEach: (init: () => void | Promise<void>) => void;
	afterAll: (init: () => void | Promise<void>) => void;
};

type RunMode = "NORMAL" | "IGNORED" | "FOCUSED";

class Test {
	context: Array<string>;
	callback: () => void | Promise<void>;
	runMode: RunMode;

	constructor({
		context,
		runMode = "NORMAL",
		callback,
	}: {
		context: Array<string>;
		runMode?: RunMode;
		callback: () => void | Promise<void>;
	}) {
		this.context = context;
		this.runMode = runMode;
		this.callback = callback;
	}
}

class Describe {
	context: Array<string>;
	runMode: RunMode;
	init: () => void | Promise<void>;

	rootDescribe: Describe;

	children: Array<Test | Describe> = [];
	befores: Array<LifecycleEvent> = [];
	afters: Array<LifecycleEvent> = [];

	constructor({
		context,
		runMode = "NORMAL",
		init,
		rootDescribe,
	}: {
		context: Array<string>;
		runMode?: RunMode;
		init: () => void | Promise<void>;
		rootDescribe: Describe;
	}) {
		this.context = context;
		this.runMode = runMode;
		this.init = init;
		this.rootDescribe = rootDescribe;
	}

	setup() {}

	getAPI(): TestAPI {
		return {
			describe: (description, init) => {
				const child = new Describe({
					context: this.context.concat(description),
					init,
					rootDescribe: this.rootDescribe,
				});
				this.children.push(child);
			},
			it: (description, callback) => {
				const child = new Test({
					context: this.context.concat(description),
					callback,
				});
				this.children.push(child);
			},
			beforeEach: (callback) => {
				this.befores.push({ callback });
			},
			beforeAll: (callback) => {
				this.rootDescribe.befores.push({ callback });
			},
			afterEach: (callback) => {
				this.afters.push({ callback });
			},
			afterAll: (callback) => {
				this.rootDescribe.afters.push({ callback });
			},
		};
	}
}

type LifecycleEvent = {
	callback: () => void | Promise<void>;
};

class TestSuite {
	// currentAPI: TestAPI;
	children: Array<Test | Describe> = [];
}
