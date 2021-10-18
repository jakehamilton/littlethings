// @ts-check

import CSSBase from "../src/components/CSSBase";
import { ThemeProvider } from "../src/contexts/Theme";
import useCSS from "../src/hooks/useCSS";

export const parameters = {
	actions: { argTypesRegex: "^on[A-Z].*" },
};

export const decorators = [
	(Story) => (
		<ThemeProvider>
			<CSSBase />
			<Story />
		</ThemeProvider>
	),
];
