import type { Test, Describe, LifecycleHook } from "./subjects";

export type TestAPI = {
	readonly describe: (
		description: string,
		body: (api: TestAPI) => void | Promise<void>
	) => void;
	readonly it: (
		description: string,
		body: () => void | Promise<void>
	) => void;
	readonly beforeEach: (body: () => void | Promise<void>) => void;
	readonly beforeAll: (body: () => void | Promise<void>) => void;
	readonly afterEach: (body: () => void | Promise<void>) => void;
	readonly afterAll: (body: () => void | Promise<void>) => void;
};

// TODO: implement it.only, etc, and during suite assembly, set runmode for everything accordingly
export type RunMode = "NORMAL" | "IGNORED" | "FOCUSED";

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
			type: "result";
			subject: Test | LifecycleHook;
			status: "PASSED" | "SKIPPED";
	  }
	| {
			type: "result";
			subject: Test | Describe | LifecycleHook;
			status: "ERRORED" | "FAILED";
			error: Error;
	  };
