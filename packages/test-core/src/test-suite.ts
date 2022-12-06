import type { TestAPI, RunMode, TestEvent } from "./types";
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

const CURRENT_API = Symbol("CURRENT_API");

export class TestSuite {
	rootDescribe: Describe;
	api: TestAPI;
	[CURRENT_API]: TestAPI;
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
		this[CURRENT_API] = this.rootDescribe.api;
		this.api = {
			describe: (description, body) => {
				this[CURRENT_API].describe(description, body);
			},
			it: (description, body) => {
				this[CURRENT_API].it(description, body);
			},
			beforeEach: (body) => {
				this[CURRENT_API].beforeEach(body);
			},
			beforeAll: (body) => {
				this[CURRENT_API].beforeAll(body);
			},
			afterEach: (body) => {
				this[CURRENT_API].afterEach(body);
			},
			afterAll: (body) => {
				this[CURRENT_API].afterAll(body);
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

		// TODO: concurrency?
		const prepareWork = async (describe: Describe) => {
			emitEvent({
				type: "starting",
				subject: describe,
			});
			this[CURRENT_API] = describe.api;
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

		emitEvent({ type: "assembly_started" });

		await prepareWork(this.rootDescribe);

		this.state = "ASSEMBLED";

		emitEvent({ type: "assembly_finished" });
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
					this[CURRENT_API] = describe.api;

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
			events: this.events,
		});

		return this.events;
	}
}
