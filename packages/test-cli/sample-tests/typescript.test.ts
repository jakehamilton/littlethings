import assert from "node:assert";
import { beforeAll, describe, it } from "..";

type Something = 5;

beforeAll(() => {
	console.log(2 + 2);
});

it("works?", (): void => {
	assert(2 + 2 == 4);
});
