import CSSBase from "../src/components/CSSBase";
import { ThemeProvider } from "../src/contexts/ThemeProvider";
import useCSS from "../src/hooks/useCSS";

export const parameters = {
	actions: { argTypesRegex: "^on[A-Z].*" },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
};

export const decorators = [
	(Story) => (
		<ThemeProvider>
			<CSSBase />
			<Story />
		</ThemeProvider>
	),
];
