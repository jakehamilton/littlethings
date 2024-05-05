const path = require("path");
const makeDebug = require("debug");

const debug = makeDebug("@littlethings/test:test-cli/load-file.ts");

let esbuildRegistered = false;

/**
 * Run a JavaScript file.
 *
 * @param {string} filename The absolute path to the file to load.
 */
exports.loadFile = function loadFile(filename) {
	debug("loadFile called with:", filename);

	if (!path.isAbsolute(filename)) {
		throw new Error(
			`loadFile requires an absolute path, but received: ${filename}`
		);
	}

	if (!esbuildRegistered) {
		debug("running esbuild-register first");
		require("esbuild-register/dist/node").register({
			target: `node${process.version.slice(1)}`,
			format: "cjs",
		});
		esbuildRegistered = true;
	}

	delete require.cache[filename];
	require(filename);
};
