import assert from "assert";
import * as vitest from "vitest";
import { TestSuite } from ".";

vitest.test("basic functionality", async () => {
	const s = new TestSuite({
		filter(subject) {
			return !subject.flags.includes("skip");
		},
	});
	const { describe, it, beforeEach, beforeAll, afterEach, afterAll } = s.api;

	const output: Array<any> = [];

	let asyncTestFinished = false;

	function write(msg: string) {
		output.push([msg, { asyncTestFinished }]);
	}

	it("is here", async () => {
		write("is here");
		await new Promise((resolve) => setTimeout(resolve, 50));
		asyncTestFinished = true;
	});

	beforeAll(() => {
		write("beforeAll");
	});

	afterAll(() => {
		write("afterAll");
	});

	describe("something", () => {
		beforeEach(() => {
			write("something -> beforeEach");
		});

		afterEach(() => {
			write("something -> afterEach");
		});

		it("works", () => {
			assert(2 + 2 === 4);
			write("something -> works -> after assertion");
		});

		it("fails", () => {
			assert(2 + 2 === 5);
			write("shouldn't be written due to failure");
		});

		it(
			"gets skipped",
			() => {
				assert(Infinity > 3);
				write("shouldn't be written due to skip");
			},
			["skip"]
		);
	});

	describe("bad", () => {
		afterEach(() => {
			write("bad -> afterEach");
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
		  [
		    "beforeAll",
		    {
		      "asyncTestFinished": false,
		    },
		  ],
		  [
		    "is here",
		    {
		      "asyncTestFinished": false,
		    },
		  ],
		  [
		    "something -> beforeEach",
		    {
		      "asyncTestFinished": true,
		    },
		  ],
		  [
		    "something -> works -> after assertion",
		    {
		      "asyncTestFinished": true,
		    },
		  ],
		  [
		    "something -> afterEach",
		    {
		      "asyncTestFinished": true,
		    },
		  ],
		  [
		    "something -> beforeEach",
		    {
		      "asyncTestFinished": true,
		    },
		  ],
		  [
		    "something -> afterEach",
		    {
		      "asyncTestFinished": true,
		    },
		  ],
		  [
		    "afterAll",
		    {
		      "asyncTestFinished": true,
		    },
		  ],
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
