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
	},
	async (options, ...args) => {
		const help = options.h || options.help;
		if (help) {
			console.log(getUsage());
			process.exit(0);
		}

		const setupFile = options.setupFile || options.r;
		const perTestSetupFile = options.perTestSetupFile;

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

		function onEvent(event: TestEvent) {
			switch (event.type) {
				case "skipping": {
					const contextString = event.subject.context.join(" ");

					console.log(
						`${kleur.bold(kleur.yellow("SKIPPED"))} ${kleur.dim(
							contextString
						)}`
					);
					break;
				}
				case "result": {
					const { status } = event;

					const contextString = event.subject.context.join(" ");
					switch (status) {
						case "PASSED": {
							console.log(
								`${kleur.bold(kleur.green(status))} ${kleur.dim(
									contextString
								)}`
							);
							break;
						}
						case "FAILED":
						case "ERRORED": {
							console.log(
								`${kleur.bold(kleur.red(status))} ${kleur.red(
									contextString
								)}`
							);

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
				case "run_finished": {
					const { events } = event;
					const passed = events.filter(
						(event) =>
							event.type === "result" && event.status === "PASSED"
					);
					const failed = events.filter(
						(event) =>
							event.type === "result" && event.status === "FAILED"
					);
					const errored = events.filter(
						(event) =>
							event.type === "result" &&
							event.status === "ERRORED"
					);
					const skipped = events.filter(
						(event) => event.type === "skipping"
					);

					const categories = {
						passed,
						failed,
						errored,
						skipped,
					};

					const categoryColors = {
						passed: passed.length === 0 ? kleur.dim : kleur.green,
						failed: failed.length === 0 ? kleur.dim : kleur.red,
						errored: errored.length === 0 ? kleur.dim : kleur.red,
						skipped:
							skipped.length === 0 ? kleur.dim : kleur.yellow,
					};

					console.log("\n");
					Object.entries(categories).forEach(
						([key, value], index, all) => {
							const message = `${value.length} ${key}`;
							const colorFn = categoryColors[key];
							process.stdout.write(colorFn(message));
							if (index === all.length - 1) {
								process.stdout.write(kleur.dim(".\n"));
							} else {
								process.stdout.write(kleur.dim(", "));
							}
						}
					);
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
