import assert from "node:assert";

console.log("hewwo?");

it("works?", () => {
	assert(2 + 2 === 5);
});

describe("blaaah", () => {
	it("works I think", () => {
		assert(2 + 2 === 4);
	});
});
