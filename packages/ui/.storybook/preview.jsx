// @ts-check

import CSSBase from "../src/components/CSSBase";
import { ThemeProvider } from "../src/contexts/Theme";

export const parameters = {
	actions: { argTypesRegex: "^on[A-Z].*" },
};

/** @type {import("../src").ThemeOverrides} */
const overrides = {
	Surface: (theme, props) => {
		return {
			root: {
				"@dark": {
					backgroundColor: theme.util.color("secondary").main,
				},
				"@light": {
					backgroundColor: theme.util.color("primary").main,
				},
			},
		};
	},
};

/** @type {import("../src").ThemeSpec} */
const spec = {
	light: { overrides },
	dark: { overrides },
};

export const decorators = [
	(Story) => (
		<ThemeProvider mode="dark" spec={spec}>
			<CSSBase />
			<Story />
		</ThemeProvider>
	),
];
