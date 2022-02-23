import { defineConfig } from "vite";

export default defineConfig({
	build: {
		lib: {
			name: "LittleTest",
			entry: "./src/index.ts",
			fileName: (format) => `test.${format}.js`,
			formats: ["es", "umd", "cjs"],
		},
	},
});
