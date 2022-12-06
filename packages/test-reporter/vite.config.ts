import { defineConfig } from "vite";

export default defineConfig({
	build: {
		lib: {
			name: "LittleTestReporter",
			entry: "./src/index.ts",
			fileName: (format) => `test-reporter.${format}.js`,
			formats: ["es", "umd", "cjs"],
		},
	},
});
