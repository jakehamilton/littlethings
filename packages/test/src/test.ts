import * as assert from "assert";
import { TestSuite } from "./index";

async function main() {
	const s = new TestSuite();

	const { describe, it } = s.api;

	it("is here", async () => {
		await new Promise((resolve) => setTimeout(resolve, 100));
	});

	describe("something", () => {
		it("works", () => {
			assert(2 + 2 === 4);
		});

		it("fails", () => {
			assert(2 + 2 === 5);
		});
	});

	describe("bad", () => {
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
