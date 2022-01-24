import { defineConfig } from "vite";

export default defineConfig({
	build: {
		lib: {
			name: "LittleCoder",
			entry: "./src/index.ts",
			fileName: (format) => `coder.${format}.js`,
			formats: ["es", "umd", "cjs"],
		},
	},
});
