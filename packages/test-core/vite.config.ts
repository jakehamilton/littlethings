import { defineConfig } from "vite";

export default defineConfig({
	build: {
		lib: {
			name: "LittleTestCore",
			entry: "./src/index.ts",
			fileName: (format) => `test-core.${format}.js`,
			formats: ["es", "umd", "cjs"],
		},
	},
});
