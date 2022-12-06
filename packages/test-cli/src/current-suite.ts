import { TestSuite } from "@littlethings/test-core";

let currentSuite: TestSuite | null;

export function getCurrentSuite(): TestSuite | null {
	return currentSuite;
}

export function setCurrentSuite(suite: TestSuite) {
	currentSuite = suite;
	Object.assign(global, suite.api);
}
