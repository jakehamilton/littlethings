import { defineConfig } from "vite";

export default defineConfig({
	build: {
		lib: {
			name: "LittleLog",
			entry: "./src/index.ts",
			fileName: (format) =>
				`littlelog.${format}.${format === "es" ? "m" : ""}js`,
			formats: ["es", "umd", "cjs"],
		},
		rollupOptions: {
			external: ["kleur"],
		},
	},
	define: {
		"process.env.NODE_ENV": "process.env.NODE_ENV",
	},
});
