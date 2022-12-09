import { getCurrentTestInfo } from "..";

describe("hello", () => {
	beforeEach(() => {
		console.log("in beforeEach", getCurrentTestInfo());
	});

	it("test name", () => {
		console.log("in test", getCurrentTestInfo());
	});
});
