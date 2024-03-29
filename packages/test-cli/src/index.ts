import type { TestAPI, TestInfo } from "@littlethings/test-core";
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

export const test: TestAPI["test"] = (...args) => {
	const currentSuite = getCurrentSuite();
	if (currentSuite == null) {
		throw new Error(
			"There is no active test suite to attach this 'test' onto"
		);
	}
	return currentSuite.api.test(...args);
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

// get TestInfo for the currently-running test, if any
export const getCurrentTestInfo = (): TestInfo | null => {
	const currentSuite = getCurrentSuite();
	if (currentSuite == null) {
		return null;
	}
	const currentTest = currentSuite.currentTest;
	if (currentTest != null) {
		return currentTest.toJSON();
	} else {
		return null;
	}
};
