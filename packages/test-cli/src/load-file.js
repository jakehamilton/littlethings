const path = require("path");

let esbuildRegistered = false;

/**
 * Run a JavaScript file.
 *
 * @param {string} filename The absolute path to the file to load.
 */
exports.loadFile = function loadFile(filename) {
	if (!path.isAbsolute(filename)) {
		throw new Error(
			`loadFile requires an absolute path, but received: ${filename}`
		);
	}

	if (!esbuildRegistered) {
		require("esbuild-register/dist/node").register({
			target: `node${process.version.slice(1)}`,
			format: "cjs",
		});
		esbuildRegistered = true;
	}

	delete require.cache[filename];
	require(filename);
};
