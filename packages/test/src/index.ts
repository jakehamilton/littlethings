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

	befores() {
		const ancestors: Array<Describe> = [];
		let currentParent = this.parent;
		while (currentParent != null) {
			ancestors.push(currentParent);
			currentParent = currentParent.parent;
		}
		ancestors.reverse();

		return ancestors.map((describe) => describe.befores).flat(1);
	}

	afters() {
		const ancestors: Array<Describe> = [];
		let currentParent = this.parent;
		while (currentParent != null) {
			ancestors.push(currentParent);
			currentParent = currentParent.parent;
		}
		ancestors.reverse();

		return ancestors.map((describe) => describe.afters).flat(1);
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
	befores: Array<LifecycleHook> = [];
	afters: Array<LifecycleHook> = [];

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
			type: "started";
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
				type: "started",
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
				}
			}
		};

		await prepareWork(this.rootDescribe);

		this.state = "ASSEMBLED";
	}

	summary(): string {
		const lines = [];

		const subjects: Array<[number, Describe | Test]> = [];

		function addSubjects(children: Array<Describe | Test>, indent: number) {
			subjects.push(
				...children.map(
					(child) => [indent, child] as [number, typeof child]
				)
			);
		}

		addSubjects(this.rootDescribe.children, 0);

		while (subjects.length > 0) {
			const [indent, currentSubject] = subjects.shift()!;

			const lastContext =
				currentSubject.context[currentSubject.context.length - 1] || "";
			lines.push(
				"  ".repeat(indent) +
					[currentSubject.type, lastContext].filter(Boolean).join(" ")
			);

			if (currentSubject.type === "Describe") {
				addSubjects(currentSubject.children, indent + 1);
			}
		}

		return lines.join("\n");
	}

	async run(): Promise<Array<TestEvent>> {
		if (this.state === "INITIAL") {
			await this.assemble();
		} else if (this.state === "HAS_RUN") {
			throw new Error("This TestSuite has already been run");
		}

		const workToDo: Array<() => void | Promise<void>> = [];
		const emitEvent = this._emitEvent.bind(this);

		const prepareWork = (describe: Describe) => {
			for (const child of describe.children) {
				if (child.type === "Describe") {
					prepareWork(child);
					continue;
				}

				workToDo.push(async () => {
					this._currentAPI = describe.api;

					for (const before of child.befores()) {
						emitEvent({
							type: "started",
							subject: before,
						});
						const maybeError = await runOrError(before.body);
						if (maybeError == null) {
							emitEvent({
								type: "result",
								subject: before,
								status: "PASSED",
							});
						} else {
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

					for (const after of child.afters()) {
						emitEvent({
							type: "started",
							subject: after,
						});
					}
				});
			}
		};

		prepareWork(this.rootDescribe);

		// TODO: concurrency
		for (const work of workToDo) {
			await work();
		}

		this.state = "HAS_RUN";
		return this.events;
	}
}
