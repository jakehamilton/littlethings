import type { Test, Describe, LifecycleHook } from "./subjects";

export type TestAPI = {
	readonly describe: (
		description: string,
		body: (api: TestAPI) => void | Promise<void>,
		flags?: Array<string>
	) => void;
	readonly it: (
		description: string,
		body: () => void | Promise<void>,
		flags?: Array<string>
	) => void;
	readonly beforeEach: (
		body: () => void | Promise<void>,
		flags?: Array<string>
	) => void;
	readonly beforeAll: (
		body: () => void | Promise<void>,
		flags?: Array<string>
	) => void;
	readonly afterEach: (
		body: () => void | Promise<void>,
		flags?: Array<string>
	) => void;
	readonly afterAll: (
		body: () => void | Promise<void>,
		flags?: Array<string>
	) => void;
};

export type TestEvent =
	| {
			type: "run_started";
	  }
	| {
			type: "run_finished";
			events: Array<TestEvent>;
	  }
	| {
			type: "assembly_started";
	  }
	| {
			type: "assembly_finished";
	  }
	| {
			type: "starting";
			subject: Test | Describe | LifecycleHook;
	  }
	| {
			type: "skipping";
			subject: Test | Describe | LifecycleHook;
	  }
	| {
			type: "result";
			subject: Test | LifecycleHook;
			status: "PASSED";
	  }
	| {
			type: "result";
			subject: Test | Describe | LifecycleHook;
			status: "ERRORED" | "FAILED";
			error: Error;
	  };
