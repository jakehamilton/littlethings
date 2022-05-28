import { clsx, css } from "@littlethings/css";
import {
	createContext,
	FunctionComponent,
	toChildArray,
	cloneElement,
	isValidElement,
} from "preact";
import { StateUpdater, useMemo, useState } from "preact/hooks";

import {
	DynamicThemePaletteColorNames,
	Theme,
	ThemeMode,
	ThemePaletteColor,
	ThemeConfig,
	ThemePalette,
	ThemeTypographyColors,
	ThemeTypographyColorNames,
	CSSThemePaletteColorNames,
} from "../types/theme";
import { createTheme } from "../util/theme";

export interface ThemeContextValue {
	theme: Theme;
	mode: ThemeMode;
	spec: ThemeConfig;
	setSpec: StateUpdater<ThemeConfig>;
	setMode: StateUpdater<ThemeMode>;
}

export const ThemeContext = createContext<ThemeContextValue>(
	{} as ThemeContextValue
);

const createPaletteCSSVars = (palette: ThemePalette) => {
	const vars: Record<`--ui-color-${CSSThemePaletteColorNames}`, string> =
		{} as Record<`--ui-color-${CSSThemePaletteColorNames}`, string>;

	for (const name of Object.keys(palette)) {
		const color = palette[name as keyof ThemePalette];

		for (const variant of Object.keys(color)) {
			const value = color[variant as keyof ThemePaletteColor];

			vars[
				`--ui-color-${name as keyof ThemePalette}-${
					variant as keyof ThemePaletteColor
				}`
			] = value;
		}
	}

	return vars;
};

const createTypographyCSSVars = (colors: ThemeTypographyColors) => {
	const vars: Record<`--ui-text-${ThemeTypographyColorNames}`, string> =
		{} as Record<`--ui-text-${ThemeTypographyColorNames}`, string>;

	for (const name of Object.keys(colors)) {
		const value = colors[name as ThemeTypographyColorNames];

		vars[`--ui-text-${name as ThemeTypographyColorNames}`] = value;
	}

	return vars;
};

export interface ThemeProviderProps {
	theme?: ThemeConfig;
	mode?: ThemeMode;
}

export const ThemeProvider: FunctionComponent<ThemeProviderProps> = ({
	theme: originalConfig = {},
	mode: originalMode = "light",
	children,
}) => {
	const [spec, setSpec] = useState(originalConfig);
	const [mode, setMode] = useState(originalMode);

	const theme = useMemo(() => {
		return createTheme(spec);
	}, [spec]);

	const classes = useMemo(() => {
		const paletteCSS = createPaletteCSSVars(theme.palette[mode]);
		const typographyCSS = createTypographyCSSVars(
			theme.typography.color[mode]
		);

		return { root: clsx(css(paletteCSS), css(typographyCSS)) };
	}, [theme, mode]);

	return (
		<ThemeContext.Provider
			value={{
				theme,
				mode,
				spec,
				setSpec,
				setMode,
			}}
		>
			{toChildArray(children).map((child) =>
				isValidElement(child)
					? cloneElement(child, {
							classes: {
								root: clsx(
									classes.root,
									(child.props as any).classes?.root
								),
							},
					  })
					: child
			)}
		</ThemeContext.Provider>
	);
};
