import kleur from "kleur";
import type { TestEvent, TestSuite } from "@littlethings/test-core";
import { formatError } from "pretty-print-error";
import {
	getLocationFromError,
	codePreviewFromError,
} from "code-preview-from-error";
import { SubjectInfo } from "@littlethings/test-core/dist/cjs/subjects";

function errorInfo(
	event: TestEvent & { type: "result"; status: "FAILED" | "ERRORED" }
): string {
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
	if (typeof loc.filePath === "string" && /node_modules/.test(loc.filePath)) {
		shouldShowPreview = false;
	}

	let filePreview: string | null = null;
	if (shouldShowPreview) {
		filePreview = codePreviewFromError(errorToExamine);
	}

	const output =
		(filePreview ? filePreview + "\n\n" : "") +
		formatError(event.error)
			.split("\n")
			.map((line) => "  " + line)
			.join("\n");

	const indented = output
		.split("\n")
		.map((line) => "  " + line)
		.join("\n");

	return indented;
}

function summarize(subject: SubjectInfo) {
	return subject.context.join(" ");
}

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

			const contextString = summarize(event.subject);
			if (contextString === "") {
				// Don't report root describe
				break;
			}

			const label = suite.state === "INITIAL" ? "LOADING" : "RUNNING";

			writeStdout(
				kleur.dim([kleur.bold(label), contextString].join(" ")) + "\n"
			);
			break;
		}

		case "skipping": {
			writeStdout(
				`${kleur.bold(kleur.yellow("SKIPPED"))} ${kleur.dim(
					summarize(event.subject)
				)}\n`
			);
			break;
		}
		case "result": {
			const { status } = event;

			switch (status) {
				case "PASSED": {
					writeStdout(
						`${kleur.bold(kleur.green(status))} ${kleur.dim(
							summarize(event.subject)
						)}\n`
					);
					break;
				}
				case "FAILED":
				case "ERRORED": {
					writeStdout(
						`${kleur.bold(kleur.red(status))} ${kleur.red(
							summarize(event.subject)
						)}\n` +
							errorInfo(event) +
							"\n"
					);
				}
			}
			break;
		}
		case "run_finished": {
			const { events } = event;
			const passed = events.filter(
				(event) => event.type === "result" && event.status === "PASSED"
			) as Array<TestEvent & { type: "result"; status: "PASSED" }>;

			const failed = events.filter(
				(event) => event.type === "result" && event.status === "FAILED"
			) as Array<TestEvent & { type: "result"; status: "FAILED" }>;

			const errored = events.filter(
				(event) => event.type === "result" && event.status === "ERRORED"
			) as Array<TestEvent & { type: "result"; status: "ERRORED" }>;

			const skipped = events.filter(
				(event) => event.type === "skipping"
			) as Array<TestEvent & { type: "skipping" }>;

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

			if (failed.length > 0) {
				writeStderr("\n");

				const sectionHeader = kleur.bgRed(
					kleur.black("  Failed tests:  ".padEnd(80, " "))
				);
				writeStderr(sectionHeader + "\n");

				for (const event of failed) {
					reportEvent({
						event,
						suite,
						verbose,
						writeStderr,
						writeStdout,
					});
				}
			}

			if (errored.length > 0) {
				writeStderr("\n");

				const sectionHeader = kleur.bgRed(
					kleur.black("  Errored tests:  ".padEnd(80, " "))
				);
				writeStderr(sectionHeader + "\n");

				for (const event of errored) {
					reportEvent({
						event,
						suite,
						verbose,
						writeStderr,
						writeStdout,
					});
				}
			}
		}
	}
}
