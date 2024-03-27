import type { TestAPI, TestEvent } from "./types";
import { Test, Describe, LifecycleHook } from "./subjects";

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

function jsonifyError(error: Error) {
	if (error == null) {
		return {
			name: "TypeError",
			message: `Non-error value was thrown: ${error}`,
			thrownValue: error,
		};
	}

	const obj = {
		name: error.name,
		message: error.message,
		stack: error.stack!,
	};

	Object.assign(obj, error);

	return obj;
}

const CURRENT_API = Symbol("CURRENT_API");

export class TestSuite {
	rootDescribe: Describe;
	api: TestAPI;
	[CURRENT_API]: TestAPI;
	onEvent: (event: TestEvent) => void;
	filter: (subject: Test | Describe | LifecycleHook) => boolean;

	state: "INITIAL" | "ASSEMBLED" | "HAS_RUN" = "INITIAL";
	events: Array<TestEvent> = [];

	/**
	 * The {@link Test} object for the currently-running test, or null if no test
	 * is currently running.
	 *
	 * Note that this is always a Test within beforeEach/afterEach callbacks, but
	 * always null within beforeAll/afterAll.
	 */
	currentTest: Test | null = null;

	constructor({
		onEvent = () => {},
		filter = () => true,
	}: {
		onEvent?: (event: TestEvent) => void;
		filter?: (subject: Test | Describe | LifecycleHook) => boolean;
	} = {}) {
		this.onEvent = onEvent;
		this.filter = filter;
		this.rootDescribe = new Describe({
			context: [],
			body: () => {},
		});
		this[CURRENT_API] = this.rootDescribe.api;
		this.api = {
			describe: (description, body, flags) => {
				this[CURRENT_API].describe(description, body, flags);
			},
			it: (description, body, flags) => {
				this[CURRENT_API].it(description, body, flags);
			},
			test: (description, body, flags) => {
				this[CURRENT_API].test(description, body, flags);
			},
			beforeEach: (body, flags) => {
				this[CURRENT_API].beforeEach(body, flags);
			},
			beforeAll: (body, flags) => {
				this[CURRENT_API].beforeAll(body, flags);
			},
			afterEach: (body, flags) => {
				this[CURRENT_API].afterEach(body, flags);
			},
			afterAll: (body, flags) => {
				this[CURRENT_API].afterAll(body, flags);
			},
		};
	}

	_emitEvent(event: TestEvent) {
		this.events.push(event);
		this.onEvent(event);
	}

	/**
	 * Goes through and runs all the `describe` callbacks, in order to figure out
	 * all the stuff to run
	 */
	async assemble(): Promise<void> {
		if (this.state !== "INITIAL") {
			throw new Error("This TestSuite has already been assembled");
		}

		const emitEvent = this._emitEvent.bind(this);

		// TODO: concurrency?
		const prepareWork = async (describe: Describe) => {
			if (!this.filter(describe)) {
				emitEvent({
					type: "skipping",
					subject: describe,
				});
				return;
			} else {
				emitEvent({
					type: "starting",
					subject: describe,
				});
			}

			this[CURRENT_API] = describe.api;
			const maybeError = await runOrError(() => describe.runBody());
			if (maybeError != null) {
				emitEvent({
					type: "result",
					subject: describe,
					status: "ERRORED",
					error: jsonifyError(maybeError),
				});
			}

			for (const child of describe.children) {
				if (child.type === "Describe") {
					await prepareWork(child);
				} else {
					if (!this.filter(child)) {
						child.gatherBefores = () => [];
						child.gatherAfters = () => [];
					} else {
						const afters = child.gatherAfters();
						child.gatherAfters = () => afters;

						const befores = child.gatherBefores();
						child.gatherBefores = () => befores;
					}
				}
			}
		};

		emitEvent({ type: "assembly_started" });

		await prepareWork(this.rootDescribe);

		this.state = "ASSEMBLED";

		emitEvent({ type: "assembly_finished" });
	}

	/**
	 * Creates a human-readable string describing the contents of this test suite
	 */
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

	/**
	 * Runs all the work that was previously discovered by a call to {@link assemble}
	 */
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
					if (!this.filter(before)) {
						emitEvent({
							type: "skipping",
							subject: before,
						});
						return;
					} else {
						emitEvent({
							type: "starting",
							subject: before,
						});
					}
					const maybeError = await runOrError(before.body);
					if (maybeError != null) {
						emitEvent({
							type: "result",
							subject: before,
							status: "ERRORED",
							error: jsonifyError(maybeError),
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
					this[CURRENT_API] = describe.api;
					this.currentTest = child;

					for (const before of child.gatherBefores()) {
						if (!this.filter(before)) {
							emitEvent({
								type: "skipping",
								subject: before,
							});
							continue;
						} else {
							emitEvent({
								type: "starting",
								subject: before,
							});
						}
						const maybeError = await runOrError(before.body);
						if (maybeError != null) {
							emitEvent({
								type: "result",
								subject: before,
								status: "ERRORED",
								error: jsonifyError(maybeError),
							});
						}
					}

					if (!this.filter(child)) {
						emitEvent({
							type: "skipping",
							subject: child,
						});
						return;
					} else {
						emitEvent({
							type: "starting",
							subject: child,
						});
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
							error: jsonifyError(maybeError),
						});
					}

					for (const after of child.gatherAfters()) {
						if (!this.filter(after)) {
							emitEvent({
								type: "skipping",
								subject: after,
							});
							continue;
						} else {
							emitEvent({
								type: "starting",
								subject: after,
							});
						}
						const maybeError = await runOrError(after.body);
						if (maybeError != null) {
							emitEvent({
								type: "result",
								subject: after,
								status: "ERRORED",
								error: jsonifyError(maybeError),
							});
						}
					}

					this.currentTest = null;
				});
			}

			for (const after of describe.afterAlls) {
				afterAllWork.push(async () => {
					if (!this.filter(after)) {
						emitEvent({
							type: "skipping",
							subject: after,
						});
						return;
					} else {
						emitEvent({
							type: "starting",
							subject: after,
						});
					}
					const maybeError = await runOrError(after.body);
					if (maybeError != null) {
						emitEvent({
							type: "result",
							subject: after,
							status: "ERRORED",
							error: jsonifyError(maybeError),
						});
					}
				});
			}
		};

		prepareWork(this.rootDescribe);

		emitEvent({ type: "run_started" });

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

		emitEvent({
			type: "run_finished",
			events: [...this.events],
		});

		return this.events;
	}
}
