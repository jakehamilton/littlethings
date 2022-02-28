import { currentSuite } from "./current-suite";

export const describe = currentSuite.api.describe;
export const it = currentSuite.api.it;
export const beforeEach = currentSuite.api.beforeEach;
export const beforeAll = currentSuite.api.beforeAll;
export const afterEach = currentSuite.api.afterEach;
export const afterAll = currentSuite.api.afterAll;
