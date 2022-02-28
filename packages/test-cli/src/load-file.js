const path = require("path");

/**
 * Run a JavaScript file.
 *
 * @param {string} filename The absolute path to the file to load.
 * @returns {Promise<void>}
 */
exports.loadFile = function loadFile(filename) {
	if (!path.isAbsolute(filename)) {
		throw new Error(
			`loadFile requires an absolute path, but received: ${filename}`
		);
	}

	// TODO: esm support, typescript support? kame would work but it's far from "little"
	delete require.cache[filename];
	try {
		require(filename);
		return Promise.resolve();
	} catch (err) {
		return import(filename).then(() => {});
	}
};
