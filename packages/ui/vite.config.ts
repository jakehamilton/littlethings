import { defineConfig, Logger } from "vite";
import preact from "@preact/preset-vite";
import log from "@littlethings/log";

const createLogger = async () => {
	// Customize logging behavior
	global.process.env.LOG_TIMESTAMP =
		global.process.env.LOG_TIMESTAMP || "true";

	const logger = log.child("vite") as unknown as Logger;

	for (const key of ["info", "warn", "error"] as const) {
		const method = logger[key];

		logger[key] = (msg, options) => {
			if (options?.clear) {
				logger.clearScreen(key);
			}
			method(msg.trim());
		};
	}

	logger.warnOnce = logger.warn;
	logger.clearScreen = (type) => {
		process.stdout.write("\u001b[3J\u001b[2J\u001b[1J");
		console.clear();
	};
	logger.hasErrorLogged = () => false;
	logger.hasWarned = false;

	return logger;
};

export default async () => {
	return defineConfig({
		customLogger: await createLogger(),
		plugins: [preact()],
		server: {
			host: "0.0.0.0",
		},
		build: {
			lib: {
				name: "LittleUI",
				entry: "./src/index.tsx",
				fileName: (format) => `ui.${format}.js`,
				formats: ["es", "umd", "cjs"],
			},
			rollupOptions: {
				external: [
					"preact",
					"@littlethings/css",
					"tinycolor2",
					"@popperjs/core",
				],
				output: {
					globals: {
						"@littlethings/css": "LittleCSS",
						preact: "Preact",
						tinycolor2: "tinycolor",
						"@poperjs/core": "Popper",
					},
				},
			},
		},
	});
};
