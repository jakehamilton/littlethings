const preact = require("@preact/preset-vite").default;

module.exports = {
	stories: [
		"../src/**/*.stories.mdx",
		"../src/**/*.stories.@(js|jsx|ts|tsx)",
	],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@storybook/addon-storysource",
	],
	core: {
		builder: "storybook-builder-vite",
	},
	async viteFinal(config) {
		config.plugins.push(preact());

		return config;
	},
};
