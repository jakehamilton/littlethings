#!/usr/bin/env node
import fs from "fs";
import path from "path";
import * as clefairy from "clefairy";
import { TestEvent, TestSuite } from "@littlethings/test-core";
import { setCurrentSuite } from "./current-suite";
import { getUsage } from "./usage";
import { loadFile } from "./load-file";
import testFilesMatcher from "./test-files-matcher";
import reportEvent from "./report-event";

function parsePath(filepath: string): string {
	if (path.isAbsolute(filepath)) return filepath;

	const absoluteFromCwd = path.resolve(process.cwd(), filepath);
	if (fs.existsSync(absoluteFromCwd)) {
		return absoluteFromCwd;
	}

	return filepath;
}

clefairy.run(
	{
		setupFile: clefairy.optionalPath,
		perTestSetupFile: clefairy.optionalPath,
		r: clefairy.optionalPath,
		help: clefairy.optionalBoolean,
		h: clefairy.optionalBoolean,
		v: clefairy.optionalBoolean,
		verbose: clefairy.optionalBoolean,
	},
	async (options, ...args) => {
		const help = options.h || options.help;
		if (help) {
			console.log(getUsage());
			process.exit(0);
		}

		const verbose = Boolean(options.verbose || options.v);

		const setupFile = options.setupFile || options.r;
		const perTestSetupFile = options.perTestSetupFile;

		let filesToRun = args.map(parsePath);

		if (filesToRun.length === 0) {
			filesToRun = await testFilesMatcher.findMatches(process.cwd());
		}

		if (filesToRun.length === 0) {
			throw new Error(
				"Couldn't find any test files to run. Run `littletest --help` for more info."
			);
		}

		let suite: TestSuite;

		function onEvent(event: TestEvent) {
			reportEvent({
				event,
				suite,
				verbose,
				writeStdout: (data) => process.stdout.write(data),
				writeStderr: (data) => process.stderr.write(data),
			});
		}

		suite = new TestSuite({ onEvent });
		setCurrentSuite(suite);

		if (setupFile) {
			await loadFile(setupFile);
		}

		for (const file of filesToRun) {
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
	}
);
