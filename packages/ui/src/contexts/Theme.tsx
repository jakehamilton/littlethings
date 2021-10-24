import { createContext, FunctionComponent } from "preact";
import { StateUpdater, useMemo, useState } from "preact/hooks";
import tinycolor from "tinycolor2";
import useLatest from "../hooks/useLatest";

import {
	DynamicThemePaletteColorNames,
	Theme,
	ThemeColorName,
	ThemeFont,
	ThemeMode,
	ThemePaletteColor,
	ThemePaletteColorName,
	ThemeRounding,
	ThemeShadows,
	ThemeSpec,
	ThemeTypographyName,
} from "../types/theme";
import { createTheme } from "../util/theme";

export interface ThemeUtil {
	space: (size: number) => number;
	round: (size: keyof ThemeRounding) => number;
	font: (name: ThemeTypographyName) => ThemeFont;
	shadow: (name: keyof ThemeShadows) => string;
	color: (color: ThemeColorName | ThemePaletteColor) => ThemePaletteColor;
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
	CSSCache: Map<any, Map<Array<any>, object>>;
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

	const themeRef = useLatest(theme);

	const CSSCache = useMemo(() => {
		return new Map();
	}, []);

	const ColorCache = useMemo(() => {
		return new Map<
			ThemePaletteColorName | DynamicThemePaletteColorNames,
			ThemePaletteColor
		>();
	}, [mode]);

	const ColorCacheRef = useLatest(ColorCache);

	const util = useMemo(() => {
		const util: ThemeUtil = {
			space: (size) => themeRef.current.spacing * size,
			round: (size) => themeRef.current.rounding[size],
			font: (name) => themeRef.current.typography[name],
			shadow: (name) => themeRef.current.shadows[name],
			color: (color) => {
				if (typeof color === "object") {
					return color;
				} else {
					const [name, variant] = color.split(".");

					if (variant === undefined || variant === "") {
						return themeRef.current.palette[
							name as ThemePaletteColorName
						];
					} else {
						if (ColorCacheRef.current.has(color)) {
							return ColorCacheRef.current.get(color)!;
						}

						const themeColor =
							themeRef.current.palette[
								name as ThemePaletteColorName
							][variant as keyof ThemePaletteColor];

						const textColor =
							themeRef.current.palette[
								name as ThemePaletteColorName
							][variant === "text" ? "main" : "text"];

						const newColor: ThemePaletteColor = {
							light:
								"#" + tinycolor(themeColor).lighten().toHex(),
							main: themeColor,
							dark: "#" + tinycolor(themeColor).darken().toHex(),
							text:
								"#" +
								tinycolor
									.mostReadable(themeColor, [textColor], {
										includeFallbackColors: true,
										level: "AA",
										size: "small",
									})
									.toHex(),
						};

						ColorCacheRef.current.set(color, newColor);

						return newColor;
					}
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
	}, []);

	return (
		<ThemeContext.Provider
			value={{
				theme,
				util,
				mode,
				spec,
				setSpec,
				setMode,
				CSSCache,
			}}
		>
			{children}
		</ThemeContext.Provider>
	);
};
