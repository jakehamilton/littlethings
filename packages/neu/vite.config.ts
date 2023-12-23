import { defineConfig } from "vite";

export default defineConfig({
	build: {
		lib: {
			name: "neu",
			entry: "src/index.ts",
			formats: ["es", "cjs", "umd"],
			fileName: (format) => `neu.${format}.js`,
		},
	},
	resolve: {
		alias: {
			"~/": "/src/",
		},
	},
});
