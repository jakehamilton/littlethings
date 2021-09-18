import { defineConfig } from "vite";

export default defineConfig({
	build: {
		lib: {
			name: "LittleCSS",
			entry: "./src/index.ts",
			fileName: (format) => `css.${format}.js`,
			formats: ["es", "umd", "cjs"],
		},
	},
});
