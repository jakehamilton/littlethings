import path from "path";
import { TestEvent, TestSuite } from "@littlethings/test-core";
import reportEvent from "@littlethings/test-reporter";
import { loadFile } from "./load-file";
import { setCurrentSuite } from "./current-suite";

export async function work({
	files,
	verbose,
	perTestSetupFile,
	setupFile,
}: {
	files: Array<string>;
	verbose: boolean;
	perTestSetupFile?: string;
	setupFile?: string;
}) {
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
		await loadFile(setupFile);
	}

	for (const file of files) {
		if (perTestSetupFile) {
			await loadFile(perTestSetupFile);
		}

		suite.api.describe(
			path.relative(process.cwd(), file),
			() => loadFile(file),
			["file"]
		);
	}

	await suite.assemble();
	await suite.run();

	return events;
}
