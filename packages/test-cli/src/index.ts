import type { TestAPI } from "@littlethings/test-core";
import { getCurrentSuite } from "./current-suite";

// These are exported so that test files can do this:
// import { describe, it, beforeEach } from "@littlethings/test";

export const describe: TestAPI["describe"] = (...args) => {
	const currentSuite = getCurrentSuite();
	if (currentSuite == null) {
		throw new Error(
			"There is no active test suite to attach this 'describe' onto"
		);
	}
	return currentSuite.api.describe(...args);
};

export const it: TestAPI["it"] = (...args) => {
	const currentSuite = getCurrentSuite();
	if (currentSuite == null) {
		throw new Error(
			"There is no active test suite to attach this 'it' onto"
		);
	}
	return currentSuite.api.it(...args);
};

export const beforeEach: TestAPI["beforeEach"] = (...args) => {
	const currentSuite = getCurrentSuite();
	if (currentSuite == null) {
		throw new Error(
			"There is no active test suite to attach this 'beforeEach' onto"
		);
	}
	return currentSuite.api.beforeEach(...args);
};

export const beforeAll: TestAPI["beforeAll"] = (...args) => {
	const currentSuite = getCurrentSuite();
	if (currentSuite == null) {
		throw new Error(
			"There is no active test suite to attach this 'beforeAll' onto"
		);
	}
	return currentSuite.api.beforeAll(...args);
};

export const afterEach: TestAPI["afterEach"] = (...args) => {
	const currentSuite = getCurrentSuite();
	if (currentSuite == null) {
		throw new Error(
			"There is no active test suite to attach this 'afterEach' onto"
		);
	}
	return currentSuite.api.afterEach(...args);
};

export const afterAll: TestAPI["afterAll"] = (...args) => {
	const currentSuite = getCurrentSuite();
	if (currentSuite == null) {
		throw new Error(
			"There is no active test suite to attach this 'afterAll' onto"
		);
	}
	return currentSuite.api.afterAll(...args);
};

// This one is exported so that stuff that uses the core APIs but doesn't use
// this CLI can still benefit from the reporting that this CLI has
import reportEvent from "./report-event";
export { reportEvent };

// And this is exported so that external tools can identify whether
// littletest's default test patterns will match a particular file
import testFilesMatcher from "./test-files-matcher";
export { testFilesMatcher };
