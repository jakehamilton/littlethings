export type TestAPI = {
	readonly describe: (
		description: string,
		body: (api: TestAPI) => void | Promise<void>
	) => void;
	readonly it: (
		description: string,
		body: () => void | Promise<void>
	) => void;
	readonly beforeEach: (body: () => void | Promise<void>) => void;
	readonly beforeAll: (body: () => void | Promise<void>) => void;
	readonly afterEach: (body: () => void | Promise<void>) => void;
	readonly afterAll: (body: () => void | Promise<void>) => void;
};

export type RunMode = "NORMAL" | "IGNORED" | "FOCUSED";

export class Test {
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

export class Describe {
	type = "Describe" as const;

	context: Array<string>;
	runMode: RunMode;
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
				this.beforeEaches.push(
					new LifecycleHook({
						context: this.context.concat("beforeEach"),
						body,
					})
				);
			},
			beforeAll: (body) => {
				this.rootDescribe.beforeAlls.push(
					new LifecycleHook({
						context: this.context.concat("beforeAll"),
						body,
					})
				);
			},
			afterEach: (body) => {
				this.afterEaches.push(
					new LifecycleHook({
						context: this.context.concat("afterEach"),
						body,
					})
				);
			},
			afterAll: (body) => {
				this.rootDescribe.afterAlls.push(
					new LifecycleHook({
						context: this.context.concat("afterAll"),
						body,
					})
				);
			},
		};
	}

	runBody() {
		this.body(this.api);
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

export type TestEvent =
	| {
			type: "starting";
			subject: Test | Describe | LifecycleHook;
	  }
	| {
			type: "result";
			subject: Test | LifecycleHook;
			status: "PASSED" | "SKIPPED";
	  }
	| {
			type: "result";
			subject: Test | Describe | LifecycleHook;
			status: "ERRORED" | "FAILED";
			error: Error;
	  };

async function runOrError(
	fn: () => void | Promise<void>
): Promise<null | Error> {
	try {
		await fn();
		return null;
	} catch (err) {
		return err as Error;
	}
}

export class TestSuite {
	rootDescribe: Describe;
	api: TestAPI;
	_currentAPI: TestAPI;
	onEvent: (event: TestEvent) => void;

	state: "INITIAL" | "ASSEMBLED" | "HAS_RUN" = "INITIAL";
	events: Array<TestEvent> = [];

	constructor({
		onEvent = () => {},
	}: {
		onEvent?: (event: TestEvent) => void;
	} = {}) {
		this.onEvent = onEvent;
		this.rootDescribe = new Describe({
			context: [],
			body: () => {},
		});
		this._currentAPI = this.rootDescribe.api;
		this.api = {
			describe: (description, body) => {
				this._currentAPI.describe(description, body);
			},
			it: (description, body) => {
				this._currentAPI.it(description, body);
			},
			beforeEach: (body) => {
				this._currentAPI.beforeEach(body);
			},
			beforeAll: (body) => {
				this._currentAPI.beforeAll(body);
			},
			afterEach: (body) => {
				this._currentAPI.afterEach(body);
			},
			afterAll: (body) => {
				this._currentAPI.afterAll(body);
			},
		};
	}

	_emitEvent(event: TestEvent) {
		this.events.push(event);
		this.onEvent(event);
	}

	async assemble(): Promise<void> {
		if (this.state !== "INITIAL") {
			throw new Error("This TestSuite has already been assembled");
		}

		const emitEvent = this._emitEvent.bind(this);

		// TODO: concurrency
		const prepareWork = async (describe: Describe) => {
			emitEvent({
				type: "starting",
				subject: describe,
			});
			this._currentAPI = describe.api;
			const maybeError = await runOrError(() => describe.runBody());
			if (maybeError != null) {
				emitEvent({
					type: "result",
					subject: describe,
					status: "ERRORED",
					error: maybeError,
				});
			}

			for (const child of describe.children) {
				if (child.type === "Describe") {
					await prepareWork(child);
				} else {
					const afters = child.gatherAfters();
					child.gatherAfters = () => afters;

					const befores = child.gatherBefores();
					child.gatherBefores = () => befores;
				}
			}
		};

		await prepareWork(this.rootDescribe);

		this.state = "ASSEMBLED";
	}

	summary(): string {
		if (this.state === "INITIAL") {
			return "<unassembled test suite>";
		}

		const lines: Array<string> = [];

		function format(subject: Describe | Test, indent: number) {
			const lastContext =
				subject.context[subject.context.length - 1] || "";

			lines.push(
				"  ".repeat(indent) +
					[subject.type, lastContext].filter(Boolean).join(" ")
			);

			if (subject.type === "Describe") {
				for (const child of subject.children) {
					format(child, indent + 1);
				}
			}
		}

		format(this.rootDescribe, 0);

		return lines.join("\n");
	}

	async run(): Promise<Array<TestEvent>> {
		if (this.state === "INITIAL") {
			await this.assemble();
		} else if (this.state === "HAS_RUN") {
			throw new Error("This TestSuite has already been run");
		}

		const emitEvent = this._emitEvent.bind(this);

		const beforeAllWork: Array<() => void | Promise<void>> = [];
		const testWork: Array<() => void | Promise<void>> = [];
		const afterAllWork: Array<() => void | Promise<void>> = [];

		const prepareWork = (describe: Describe) => {
			for (const before of describe.beforeAlls) {
				beforeAllWork.push(async () => {
					emitEvent({
						type: "starting",
						subject: before,
					});
					const maybeError = await runOrError(before.body);
					if (maybeError != null) {
						emitEvent({
							type: "result",
							subject: before,
							status: "ERRORED",
							error: maybeError,
						});
					}
				});
			}

			for (const child of describe.children) {
				if (child.type === "Describe") {
					prepareWork(child);
					continue;
				}

				testWork.push(async () => {
					this._currentAPI = describe.api;

					for (const before of child.gatherBefores()) {
						emitEvent({
							type: "starting",
							subject: before,
						});
						const maybeError = await runOrError(before.body);
						if (maybeError != null) {
							emitEvent({
								type: "result",
								subject: before,
								status: "ERRORED",
								error: maybeError,
							});
						}
					}

					const maybeError = await runOrError(child.body);
					if (maybeError == null) {
						emitEvent({
							type: "result",
							subject: child,
							status: "PASSED",
						});
					} else {
						emitEvent({
							type: "result",
							subject: child,
							status: "FAILED",
							error: maybeError,
						});
					}

					for (const after of child.gatherAfters()) {
						emitEvent({
							type: "starting",
							subject: after,
						});
						const maybeError = await runOrError(after.body);
						if (maybeError != null) {
							emitEvent({
								type: "result",
								subject: after,
								status: "ERRORED",
								error: maybeError,
							});
						}
					}
				});
			}

			for (const after of describe.afterAlls) {
				afterAllWork.push(async () => {
					emitEvent({
						type: "starting",
						subject: after,
					});
					const maybeError = await runOrError(after.body);
					if (maybeError != null) {
						emitEvent({
							type: "result",
							subject: after,
							status: "ERRORED",
							error: maybeError,
						});
					}
				});
			}
		};

		prepareWork(this.rootDescribe);

		for (const work of beforeAllWork) {
			await work();
		}

		// TODO: concurrency
		for (const work of testWork) {
			await work();
		}

		for (const work of afterAllWork) {
			await work();
		}

		this.state = "HAS_RUN";
		return this.events;
	}
}
