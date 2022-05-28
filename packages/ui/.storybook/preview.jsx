// @ts-check

import CSSBase from "../src/components/CSSBase";
import { ThemeProvider } from "../src/contexts/Theme";

export const parameters = {
	actions: { argTypesRegex: "^on[A-Z].*" },
};

/** @type {import("../src").ThemeConfig} */
const theme = {
	overrides: {
		Surface: (theme, props) => {
			return {
				root: {
					backgroundColor: theme.color("primary"),
				},
			};
		},
	},
};

export const decorators = [
	(Story) => (
		<ThemeProvider mode="dark" theme={theme}>
			<CSSBase />
			{(props) => {
				return (
					<div class={props.classes.root}>
						<Story />
					</div>
				);
			}}
		</ThemeProvider>
	),
];
