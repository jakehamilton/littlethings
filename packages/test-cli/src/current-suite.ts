import { TestSuite } from "@littlethings/test-core";

export let currentSuite: TestSuite;

export function setCurrentSuite(suite: TestSuite) {
	currentSuite = suite;
	Object.assign(global, suite.api);
}
