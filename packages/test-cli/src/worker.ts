import path from "path";
import makeDebug from "debug";
import { TestEvent, TestSuite } from "@littlethings/test-core";
import reportEvent from "@littlethings/test-reporter";
import { loadFile } from "./load-file";
import { setCurrentSuite } from "./current-suite";

const debug = makeDebug("@littlethings/test:test-cli/worker.ts");

export async function work(args: {
	files: Array<string>;
	verbose: boolean;
	perTestSetupFile?: string;
	setupFile?: string;
}) {
	debug("test worker starting with arguments:", args);

	const { files, verbose, perTestSetupFile, setupFile } = args;

	let events: Array<TestEvent> = [];

	let suite = new TestSuite({ onEvent });

	function onEvent(event: TestEvent) {
		if (event.type === "run_finished") {
			events = event.events;
			return;
		}

		reportEvent({
			event,
			suite,
			verbose,
			writeStdout: (data) => process.stdout.write(data),
			writeStderr: (data) => process.stderr.write(data),
		});
	}

	setCurrentSuite(suite);

	if (setupFile) {
		debug("loading setup file:", setupFile);
		await loadFile(setupFile);
	}

	for (const file of files) {
		if (perTestSetupFile) {
			debug("loading per-test setup file:", perTestSetupFile);
			await loadFile(perTestSetupFile);
		}

		suite.api.describe(
			path.relative(process.cwd(), file),
			() => {
				debug("loading test file:", file);
				loadFile(file);
			},
			["file"]
		);
	}

	debug(">>> ASSEMBLING SUITE (running describes)");
	await suite.assemble();
	debug(">>> RUNNING SUITE (running tests/befores/afters)");
	await suite.run();

	return events;
}
