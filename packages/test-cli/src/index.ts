import { currentSuite } from "./current-suite";

// These are exported so that test files can do this:
// import { describe, it, beforeEach } from "@littlethings/test";

export const describe: typeof currentSuite.api.describe = (...args) =>
	currentSuite.api.describe(...args);

export const it: typeof currentSuite.api.it = (...args) =>
	currentSuite.api.it(...args);

export const beforeEach: typeof currentSuite.api.beforeEach = (...args) =>
	currentSuite.api.beforeEach(...args);

export const beforeAll: typeof currentSuite.api.beforeAll = (...args) =>
	currentSuite.api.beforeAll(...args);

export const afterEach: typeof currentSuite.api.afterEach = (...args) =>
	currentSuite.api.afterEach(...args);

export const afterAll: typeof currentSuite.api.afterAll = (...args) =>
	currentSuite.api.afterAll(...args);
