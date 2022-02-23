import assert from "assert";
import * as vitest from "vitest";
import { TestSuite } from ".";

vitest.test("basic functionality", async () => {
	const s = new TestSuite();
	const { describe, it, beforeEach, beforeAll, afterEach, afterAll } = s.api;

	const output = [];

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
	});

	describe("bad", () => {
		afterEach(() => {
			writeTime();
		});

		throw new Error("no :)");
	});

	const events = await s.run();

	output.push(
		events.map((event) => ({
			...event,
			subject: `${event.subject.type} ${JSON.stringify(
				event.subject.context
			)}`,
		}))
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
		      "subject": "LifecycleHook [\\"beforeAll #1\\"]",
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
		      "subject": "LifecycleHook [\\"afterAll #1\\"]",
		      "type": "starting",
		    },
		  ],
		]
	`);
});
