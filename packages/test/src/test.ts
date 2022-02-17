import * as assert from "assert";
import { TestSuite } from "./index";

async function main() {
	const s = new TestSuite();

	const { describe, it, beforeEach, beforeAll, afterEach, afterAll } = s.api;

	it("is here", async () => {
		await new Promise((resolve) => setTimeout(resolve, 100));
	});

	beforeAll(() => {
		console.log(Date.now());
	});

	afterAll(() => {
		console.log(Date.now());
	});

	describe("something", () => {
		beforeEach(() => {
			console.log(Date.now());
		});

		afterEach(() => {
			console.log(Date.now());
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
			console.log(Date.now());
		});

		throw new Error("no :)");
	});

	const events = await s.run();

	console.log(
		events.map((event) => ({
			...event,
			subject: `${event.subject.type} ${JSON.stringify(
				event.subject.context
			)}`,
		}))
	);
}

main().catch((err) => {
	console.error(err);
	process.exitCode = 1;
});
