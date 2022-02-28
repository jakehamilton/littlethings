#!/usr/bin/env node
import fs from "fs";
import path from "path";
import kleur from "kleur";
import * as clefairy from "clefairy";
import glomp from "glomp";
import { TestEvent, TestSuite } from "@littlethings/test-core";
import { currentSuite, setCurrentSuite } from "./current-suite";
import { getUsage } from "./usage";
import { loadFile } from "./load-file";
import { formatError } from "pretty-print-error";
import highlight from "@babel/highlight";

function parsePath<Path extends string | undefined>(filepath: Path): Path {
	// @ts-ignore could be instantiated with different subtype constraint
	if (!filepath) return undefined;
	if (path.isAbsolute(filepath)) return filepath;

	const absoluteFromCwd = path.resolve(process.cwd(), filepath);
	if (fs.existsSync(absoluteFromCwd)) {
		// @ts-ignore could be instantiated with different subtype constraint
		return absoluteFromCwd;
	}

	return filepath;
}

clefairy.run(
	{
		setupFile: clefairy.optionalString,
		perTestSetupFile: clefairy.optionalString,
		r: clefairy.optionalString,
		help: clefairy.optionalBoolean,
		h: clefairy.optionalBoolean,
	},
	async (options, ...args) => {
		const help = options.h || options.help;
		if (help) {
			console.log(getUsage());
			process.exit(0);
		}

		const setupFile = parsePath(options.setupFile || options.r);
		const perTestSetupFile = parsePath(options.perTestSetupFile);

		let filesToRun = args.map(parsePath);

		if (filesToRun.length === 0) {
			const isJsFile = glomp
				.withExtension(".js")
				.or(glomp.withExtension(".mjs"));

			const isDotSpecOrDotTest = glomp.withNameMatchingRegExp(
				/\.(spec|test)\.[\w\-]+$/
			);

			filesToRun = await glomp
				.excludeDir("node_modules")
				.and(
					isJsFile
						.and(isDotSpecOrDotTest)
						.or(
							isJsFile.and(
								glomp.withAbsolutePathMatchingRegExp(
									/__tests__/
								)
							)
						)
				)
				.findMatches(process.cwd());
		}

		if (filesToRun.length === 0) {
			throw new Error(
				"Couldn't find any test files to run. Run `littletest --help` for more info."
			);
		}

		const colorForStatus = {
			PASSED: kleur.green,
			SKIPPED: kleur.yellow,
			ERRORED: kleur.red,
			FAILED: kleur.red,
		};
		const colorForContextString = {
			PASSED: kleur.dim,
			SKIPPED: kleur.yellow,
			ERRORED: kleur.red,
			FAILED: kleur.red,
		};

		function onEvent(event: TestEvent) {
			const contextString = event.subject.context.join(" ");

			switch (event.type) {
				case "starting": {
					if (event.subject.type === "Test") {
						console.log(kleur.dim());
					}
					break;
				}
				case "result": {
					const { status } = event;

					console.log(
						`${kleur.bold(
							colorForStatus[status](status)
						)} ${colorForContextString[status](contextString)}`
					);

					switch (status) {
						case "FAILED":
						case "ERRORED": {
							let filePreview = "";
							try {
								const firstTrace = (
									event.error.stack
										?.split("\n")
										.slice(1)[0] || ""
								).trim();

								let offendingFile: string | undefined;
								let offendingLine: number | undefined;

								if (firstTrace) {
									const matches = firstTrace.match(
										/^at (?:[\w\.]+ \()?(?:file:\/\/)?([^\)]+)\)?$/
									);
									if (matches) {
										offendingFile = matches[1].replace(
											/:\d+:\d+$/,
											""
										);
										offendingLine = Number(
											matches[1].split(":")[1]
										);
									}
								}

								if (
									offendingFile &&
									offendingLine != null &&
									!Number.isNaN(offendingLine) &&
									fs.existsSync(offendingFile)
								) {
									const content = fs.readFileSync(
										offendingFile,
										"utf-8"
									);

									const lines = content
										.replace(/\t/g, "  ")
										.split("\n")
										.map((line, index) => {
											return {
												lineNumber: index + 1,
												content: line,
											};
										});

									let interestingPart = lines.slice(
										offendingLine - 3,
										offendingLine + 3
									);

									while (
										interestingPart[0] != null &&
										interestingPart[0].content.trim() === ""
									) {
										interestingPart.shift();
									}

									while (
										interestingPart[
											interestingPart.length - 1
										] != null &&
										interestingPart[
											interestingPart.length - 1
										].content.trim() === ""
									) {
										interestingPart.pop();
									}

									filePreview = interestingPart
										.map(({ lineNumber, content }) => {
											const lastLine =
												interestingPart[
													interestingPart.length - 1
												];

											const maxLineNumberCharWidth =
												String(
													lastLine.lineNumber
												).length;

											const paddedLineNumber = String(
												lineNumber
											).padEnd(
												maxLineNumberCharWidth,
												" "
											);

											return (
												"  " +
												(lineNumber === offendingLine
													? kleur.red(
															kleur.bold(
																paddedLineNumber +
																	" > | "
															)
													  ) + highlight(content)
													: kleur.dim(
															paddedLineNumber +
																"   | " +
																highlight(
																	content
																)
													  ))
											);
										})
										.join("\n");

									filePreview =
										"  " +
										kleur.dim(
											kleur.underline(
												`${path.relative(
													process.cwd(),
													offendingFile
												)}`
											)
										) +
										"\n" +
										filePreview;
								}
							} catch (err) {
								// ignored
							}

							const output =
								"\n" +
								(filePreview ? filePreview + "\n\n" : "") +
								formatError(event.error)
									.split("\n")
									.map((line) => "  " + line)
									.join("\n") +
								"\n";

							console.error(output);
						}
					}
					break;
				}
			}
		}

		const suite = new TestSuite({ onEvent });
		setCurrentSuite(suite);

		if (setupFile) {
			await loadFile(setupFile);
		}

		for (const file of filesToRun) {
			if (perTestSetupFile) {
				await loadFile(perTestSetupFile);
			}

			currentSuite.api.describe(
				path.relative(process.cwd(), file),
				async () => await loadFile(file)
			);
		}

		await suite.assemble();
		await suite.run();
	}
);
