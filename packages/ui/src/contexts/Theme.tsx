import { createContext, FunctionComponent } from "preact";
import { StateUpdater, useMemo, useState } from "preact/hooks";
import tinycolor from "tinycolor2";

import {
	Theme,
	ThemeFont,
	ThemeMode,
	ThemePaletteColor,
	ThemePaletteColorNames,
	ThemeRounding,
	ThemeShadows,
	ThemeSpec,
	ThemeTypography,
	ThemeTypographyName,
} from "../types/theme";
import { createTheme } from "../util/theme";

export interface ThemeUtil {
	space: (size: number) => number;
	round: (size: keyof ThemeRounding) => number;
	font: (name: ThemeTypographyName) => ThemeFont;
	shadow: (name: keyof ThemeShadows) => string;
	color: (
		color: ThemePaletteColorNames | ThemePaletteColor
	) => ThemePaletteColor;
	lighten: (color: string, amount?: number) => string;
	darken: (color: string, amount?: number) => string;
	isReadable: (
		background: string,
		color: string,
		options?: { ratio?: number }
	) => boolean;
	mostReadable: (
		background: string,
		colors: Array<string>,
		options: {
			level?: "AA" | "AAA";
			fallback?: boolean;
			size?: "large" | "small";
		}
	) => string;
}

export interface ThemeContextValue {
	theme: Theme;
	util: ThemeUtil;
	mode: ThemeMode;
	spec: ThemeSpec;
	setSpec: StateUpdater<ThemeSpec>;
	setMode: StateUpdater<ThemeMode>;
}

export const ThemeContext = createContext<ThemeContextValue>(
	{} as ThemeContextValue
);

export interface ThemeProviderProps {
	spec?: ThemeSpec;
	mode?: ThemeMode;
}

export const ThemeProvider: FunctionComponent<ThemeProviderProps> = ({
	spec: originalSpec = {},
	mode: originalMode = "light",
	children,
}) => {
	const [spec, setSpec] = useState(originalSpec);
	const [mode, setMode] = useState(originalMode);

	const themes = useMemo(() => {
		return createTheme(spec);
	}, [spec]);

	const theme = useMemo(() => {
		return themes[mode];
	}, [themes, mode]);

	const util = useMemo(() => {
		const util: ThemeUtil = {
			space: (size) => theme.spacing * size,
			round: (size) => theme.rounding[size],
			font: (name) => theme.typography[name],
			shadow: (name) => theme.shadows[name],
			color: (color) => {
				if (typeof color === "object") {
					return color;
				} else {
					return theme.palette[color];
				}
			},
			lighten: (color, amount) => {
				return "#" + tinycolor(color).brighten(amount).toHex();
			},
			darken: (color, amount) => {
				return "#" + tinycolor(color).darken(amount).toHex();
			},
			isReadable: (
				background: string,
				color: string,
				{ ratio = 3.1 } = {}
			) => {
				return tinycolor.readability(background, color) > ratio;
			},
			mostReadable: (
				background,
				colors,
				{ level = "AA", fallback = false, size = undefined } = {}
			) => {
				return (
					"#" +
					tinycolor
						.mostReadable(background, colors, {
							includeFallbackColors: fallback,
							level,
							size,
						})
						.toHex()
				);
			},
		};

		return util;
	}, [theme]);

	return (
		<ThemeContext.Provider
			value={{
				theme,
				util,
				mode,
				spec,
				setSpec,
				setMode,
			}}
			children={children}
		/>
	);
};
