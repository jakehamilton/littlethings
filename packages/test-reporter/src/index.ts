import kleur from "kleur";
import type { TestEvent, TestSuite } from "@littlethings/test-core";
import { formatError } from "pretty-print-error";
import {
	getLocationFromError,
	codePreviewFromError,
} from "code-preview-from-error";

export default function reportEvent({
	event,
	suite,
	verbose,
	writeStdout,
	writeStderr,
}: {
	event: TestEvent;
	suite: TestSuite;
	verbose: boolean;
	writeStdout: (data: string) => void;
	writeStderr: (data: string) => void;
}) {
	switch (event.type) {
		case "starting": {
			// Only print "starting" messages when --verbose or -v is used
			if (!verbose) break;

			const contextString = event.subject.context.join(" ");
			if (contextString === "") {
				// Don't report root describe
				break;
			}

			const label = suite.state === "INITIAL" ? "LOADING" : "RUNNING";

			writeStdout(
				kleur.dim([kleur.bold(label), contextString].join(" "))
			);
			writeStdout("\n");
			break;
		}

		case "skipping": {
			const contextString = event.subject.context.join(" ");

			writeStdout(
				`${kleur.bold(kleur.yellow("SKIPPED"))} ${kleur.dim(
					contextString
				)}`
			);
			writeStdout("\n");
			break;
		}
		case "result": {
			const { status } = event;

			const contextString = event.subject.context.join(" ");
			switch (status) {
				case "PASSED": {
					writeStdout(
						`${kleur.bold(kleur.green(status))} ${kleur.dim(
							contextString
						)}`
					);
					writeStdout("\n");
					break;
				}
				case "FAILED":
				case "ERRORED": {
					writeStdout(
						`${kleur.bold(kleur.red(status))} ${kleur.red(
							contextString
						)}`
					);
					writeStdout("\n");

					let errorToExamine: any = event.error;

					if (
						Array.isArray(errorToExamine.errors) &&
						errorToExamine.errors.length > 0 &&
						typeof errorToExamine.errors[0].location === "object" &&
						errorToExamine.errors[0].location != null &&
						typeof errorToExamine.errors[0].text === "string"
					) {
						// esbuild transform error; probably syntax error
						const esbuildErr = errorToExamine.errors[0];
						const loc = esbuildErr.location;

						const syntheticError = new Error(esbuildErr.text);
						syntheticError.stack =
							esbuildErr.text +
							"\n" +
							`  at esbuildTransform (${loc.file}:${loc.line}:${loc.column})\n`;

						errorToExamine = syntheticError;
					}

					let shouldShowPreview = true;
					const loc = getLocationFromError(errorToExamine);
					if (
						typeof loc.filePath === "string" &&
						/node_modules/.test(loc.filePath)
					) {
						shouldShowPreview = false;
					}

					let filePreview: string | null = null;
					if (shouldShowPreview) {
						filePreview = codePreviewFromError(errorToExamine);
					}

					const output =
						"\n" +
						(filePreview ? filePreview + "\n\n" : "") +
						formatError(event.error)
							.split("\n")
							.map((line) => "  " + line)
							.join("\n") +
						"\n";

					const indented = output
						.split("\n")
						.map((line) => "  " + line)
						.join("\n");

					writeStderr(indented + "\n");
				}
			}
			break;
		}
		case "run_finished": {
			const { events } = event;
			const passed = events.filter(
				(event) => event.type === "result" && event.status === "PASSED"
			);
			const failed = events.filter(
				(event) => event.type === "result" && event.status === "FAILED"
			);
			const errored = events.filter(
				(event) => event.type === "result" && event.status === "ERRORED"
			);
			const skipped = events.filter((event) => event.type === "skipping");

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
				skipped: skipped.length === 0 ? kleur.dim : kleur.yellow,
			};

			writeStdout("\n");
			Object.entries(categories).forEach(([key, value], index, all) => {
				const message = `${value.length} ${key}`;
				const colorFn = categoryColors[key];
				writeStdout(colorFn(message));
				if (index === all.length - 1) {
					writeStdout(kleur.dim(".\n"));
				} else {
					writeStdout(kleur.dim(", "));
				}
			});
		}
	}
}
