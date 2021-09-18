import { defineConfig, Logger } from "vite";
import preact from "@preact/preset-vite";

const createLogger = async () => {
	// Customize logging behavior
	global.process.env.LOG_TIMESTAMP =
		global.process.env.LOG_TIMESTAMP || "true";

	const { default: littlelog } = await import("@littlethings/log");

	const logger = littlelog.create("vite") as unknown as Logger;

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
	});
};
