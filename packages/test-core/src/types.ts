import type { TestInfo, DescribeInfo, LifecycleHookInfo } from "./subjects";

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
	readonly test: (
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
			subject: TestInfo | DescribeInfo | LifecycleHookInfo;
	  }
	| {
			type: "skipping";
			subject: TestInfo | DescribeInfo | LifecycleHookInfo;
	  }
	| {
			type: "result";
			subject: TestInfo | LifecycleHookInfo;
			status: "PASSED";
	  }
	| {
			type: "result";
			subject: TestInfo | DescribeInfo | LifecycleHookInfo;
			status: "ERRORED" | "FAILED";
			error: { name: string; message: string; stack?: string };
	  };
