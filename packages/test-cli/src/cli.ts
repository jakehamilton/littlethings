#!/usr/bin/env node
import fs from "fs";
import path from "path";
import os from "os";
import kleur from "kleur";
import * as clefairy from "clefairy";
import makeDebug from "debug";
import { TestEvent, TestSuite } from "@littlethings/test-core";
import reportEvent from "@littlethings/test-reporter";
import { runJobs, inChildProcess } from "parallel-park";
import { getUsage } from "./usage";
import testFilesMatcher from "./test-files-matcher";

const debug = makeDebug("@littlethings/test:test-cli/cli.ts");
const workerPath = require.resolve("./worker");

function parsePath(filepath: string): string {
	if (path.isAbsolute(filepath)) {
		debug("parsePath:", filepath, "->", filepath);
		return filepath;
	}

	const absoluteFromCwd = path.resolve(process.cwd(), filepath);
	if (fs.existsSync(absoluteFromCwd)) {
		debug("parsePath:", filepath, "->", absoluteFromCwd);
		return absoluteFromCwd;
	} else {
		throw new Error(
			`No such file: ${JSON.stringify(
				filepath
			)}. If you are using a glob, make sure it is NOT wrapped in quotes!`
		);
	}
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
		concurrency: clefairy.optionalNumber,
	},
	async (options, ...args) => {
		debug("input options:", options);
		debug("positional args (input files):", args);

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
			debug(
				"no input files specified; looking for files with test-like names/paths"
			);
			filesToRun = await testFilesMatcher.findMatches(process.cwd());
		}

		if (filesToRun.length === 0) {
			throw new Error(
				"Couldn't find any test files to run. Run `littletest --help` for more info."
			);
		}

		debug(`going to run ${filesToRun.length} test files`);

		const concurrency = options.concurrency ?? os.cpus().length - 1;

		if (concurrency < 1) {
			throw new Error(`Invalid concurrency value: ${concurrency}`);
		}

		debug("using concurrency:", concurrency);

		if (verbose) {
			console.log(
				kleur.dim(
					`Loading ${filesToRun.length} test files with concurrency set to: ${concurrency}`
				)
			);
		}

		let concurrencyGroups: Array<Array<string>> = Array(concurrency)
			.fill(undefined)
			.map(() => []);

		let i = 0;
		for (const file of filesToRun) {
			concurrencyGroups[i].push(file);
			i += 1;
			if (i === concurrencyGroups.length) {
				i = 0;
			}
		}

		concurrencyGroups = concurrencyGroups.filter(
			(array) => array.length > 0
		);

		if (verbose) {
			console.log(
				kleur.dim(
					concurrencyGroups
						.map((group, index) => {
							const processName =
								concurrency === 1
									? "Main process"
									: `Subprocess ${index + 1}`;
							return `${processName} will run ${group.length} files`;
						})
						.join("\n")
				)
			);
		}

		if (debug.enabled) {
			debug(
				`Concurrency groups:\n${concurrencyGroups
					.map((group, index) => {
						const processName =
							concurrency === 1
								? "Main process"
								: `Subprocess ${index + 1}`;
						return [
							`${processName} (${group.length} file${
								group.length === 1 ? "" : "s"
							}):`,
							...group.map((file) => "- " + file),
						].join("\n");
					})
					.join("\n")}`
			);
		}

		type WorkerRunner = <
			Result extends any,
			Inputs extends { [key: string]: any }
		>(
			inputs: Inputs,
			mapper: (inputs: Inputs) => Promise<Result>
		) => Promise<Result>;

		// Don't spawn any child processes when concurrency is 1; instead, run them in the CLI process.
		const runnerFunction: WorkerRunner =
			concurrency === 1
				? (inputs, mapper) => {
						return mapper(inputs);
				  }
				: inChildProcess;

		const eventsByGroup = await runJobs<Array<string>, Array<TestEvent>>(
			concurrencyGroups,
			(filesFromGroup, index, length) => {
				debug(
					`starting concurrency group ${
						index + 1
					} of ${length} (we're allowed to have up to ${concurrency} running at a time)`
				);
				return runnerFunction(
					{
						filesFromGroup,
						verbose,
						perTestSetupFile,
						setupFile,
						workerPath,
					},
					async ({
						filesFromGroup,
						verbose,
						perTestSetupFile,
						setupFile,
						workerPath,
					}) => {
						const worker = require(workerPath);
						const results = await worker.work({
							files: filesFromGroup,
							verbose,
							perTestSetupFile,
							setupFile,
						});
						return results;
					}
				);
			},
			{ concurrency }
		);

		const allEvents = eventsByGroup.flat(1);

		debug("dispatching run_finished event");
		const syntheticCompletionEvent = {
			type: "run_finished" as const,
			events: allEvents,
		};
		const placeholderSuite = new TestSuite();

		reportEvent({
			event: syntheticCompletionEvent,
			suite: placeholderSuite,
			verbose,
			writeStdout: (data) => process.stdout.write(data),
			writeStderr: (data) => process.stderr.write(data),
		});
	}
);
