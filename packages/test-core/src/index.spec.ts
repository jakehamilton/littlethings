import assert from "assert";
import * as vitest from "vitest";
import { TestSuite } from ".";

vitest.test("basic functionality", async () => {
	const s = new TestSuite({
		filter(subject) {
			return !subject.flags.has("skip");
		},
	});
	const { describe, it, beforeEach, beforeAll, afterEach, afterAll } = s.api;

	const output: Array<any> = [];

	const startTime = Date.now();
	function writeTime() {
		const now = Date.now();
		const elapsedTime = now - startTime;
		output.push(Math.round(elapsedTime / 50) * 50);
	}

	it("is here", async () => {
		await new Promise((resolve) => setTimeout(resolve, 100));
	});

	beforeAll(() => {
		writeTime();
	});

	afterAll(() => {
		writeTime();
	});

	describe("something", () => {
		beforeEach(() => {
			writeTime();
		});

		afterEach(() => {
			writeTime();
		});

		it("works", () => {
			assert(2 + 2 === 4);
		});

		it("fails", () => {
			assert(2 + 2 === 5);
		});

		it(
			"gets skipped",
			() => {
				assert(Infinity > 3);
			},
			["skip"]
		);
	});

	describe("bad", () => {
		afterEach(() => {
			writeTime();
		});

		throw new Error("no :)");
	});

	const events = await s.run();

	output.push(
		events.map((event: any) => {
			const copy = {
				...event,
			};

			if (event.subject) {
				copy.subject = `${event.subject.type} ${JSON.stringify(
					event.subject.context
				)}`;
			}

			if (event.events) {
				copy.events = `${event.events.length} Events`;
			}

			return copy;
		})
	);

	vitest.expect(output).toMatchInlineSnapshot(`
		[
		  0,
		  100,
		  100,
		  100,
		  100,
		  100,
		  [
		    {
		      "type": "assembly_started",
		    },
		    {
		      "subject": "Describe []",
		      "type": "starting",
		    },
		    {
		      "subject": "Describe [\\"something\\"]",
		      "type": "starting",
		    },
		    {
		      "subject": "Describe [\\"bad\\"]",
		      "type": "starting",
		    },
		    {
		      "error": [Error: no :)],
		      "status": "ERRORED",
		      "subject": "Describe [\\"bad\\"]",
		      "type": "result",
		    },
		    {
		      "type": "assembly_finished",
		    },
		    {
		      "type": "run_started",
		    },
		    {
		      "subject": "LifecycleHook [\\"beforeAll #1\\"]",
		      "type": "starting",
		    },
		    {
		      "subject": "Test [\\"is here\\"]",
		      "type": "starting",
		    },
		    {
		      "status": "PASSED",
		      "subject": "Test [\\"is here\\"]",
		      "type": "result",
		    },
		    {
		      "subject": "LifecycleHook [\\"something\\",\\"beforeEach #1\\"]",
		      "type": "starting",
		    },
		    {
		      "subject": "Test [\\"something\\",\\"works\\"]",
		      "type": "starting",
		    },
		    {
		      "status": "PASSED",
		      "subject": "Test [\\"something\\",\\"works\\"]",
		      "type": "result",
		    },
		    {
		      "subject": "LifecycleHook [\\"something\\",\\"afterEach #1\\"]",
		      "type": "starting",
		    },
		    {
		      "subject": "LifecycleHook [\\"something\\",\\"beforeEach #1\\"]",
		      "type": "starting",
		    },
		    {
		      "subject": "Test [\\"something\\",\\"fails\\"]",
		      "type": "starting",
		    },
		    {
		      "error": [AssertionError: The expression evaluated to a falsy value:
		
		  assert(2 + 2 === 4)
		],
		      "status": "FAILED",
		      "subject": "Test [\\"something\\",\\"fails\\"]",
		      "type": "result",
		    },
		    {
		      "subject": "LifecycleHook [\\"something\\",\\"afterEach #1\\"]",
		      "type": "starting",
		    },
		    {
		      "subject": "Test [\\"something\\",\\"gets skipped\\"]",
		      "type": "skipping",
		    },
		    {
		      "subject": "LifecycleHook [\\"afterAll #1\\"]",
		      "type": "starting",
		    },
		    {
		      "events": "21 Events",
		      "type": "run_finished",
		    },
		  ],
		]
	`);
});
