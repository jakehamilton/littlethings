import {
	FilledButtonClasses,
	FilledButtonProps,
} from "../components/Button/FilledButton";
import {
	OutlinedButtonClasses,
	OutlinedButtonProps,
} from "../components/Button/OutlinedButton";
import {
	TextButtonClasses,
	TextButtonProps,
} from "../components/Button/TextButton";
import { GapClasses, GapProps } from "../components/Gap";
import {
	IconButtonClasses,
	IconButtonProps,
} from "../components/Button/IconButton";
import { LoadingClasses, LoadingProps } from "../components/Loading";
import { SurfaceClasses, SurfaceProps } from "../components/Surface";
import { CSSFactory, CSSFactoryInput } from "../hooks/useCSS";
import { CSSClasses } from "./css";
import { ProseClasses, ProseProps } from "../components/Prose";
import { InputClasses, InputProps } from "../components/Input";
import { StylesValue, StyleUtil } from "../theme/style";
import { CSSBaseClasses } from "../components/CSSBase";

export type ThemeMode = "light" | "dark";

export interface ThemeRounding {
	xs: number;
	sm: number;
	md: number;
	lg: number;
	xl: number;
}

export interface ThemeRoundingConfig {
	xs?: number;
	sm?: number;
	md?: number;
	lg?: number;
	xl?: number;
}

export interface ThemePaletteColor {
	light: string;
	main: string;
	dark: string;
	text: string;
}

export interface ThemePaletteColorConfig {
	light: string;
	main: string;
	dark: string;
	text: string;
}

export interface ThemePalette {
	primary: ThemePaletteColor;
	secondary: ThemePaletteColor;
	background: ThemePaletteColor;
	disabled: ThemePaletteColor;
}

export type ThemePaletteColorName = keyof ThemePalette;

export type CSSThemePaletteColorNames =
	`${keyof ThemePalette}-${keyof ThemePaletteColor}`;
export type DynamicThemePaletteColorNames =
	`${keyof ThemePalette}.${keyof ThemePaletteColor}`;

export type ThemeColorName =
	| ThemePaletteColorName
	| DynamicThemePaletteColorNames;

export interface ThemePaletteConfig {
	primary?: ThemePaletteColorConfig;
	secondary?: ThemePaletteColorConfig;
	background?: ThemePaletteColorConfig;
}

export interface ThemeFontSize {
	size: number;
	height: number;
	weight: number;
}

export interface ThemeFontVariant extends ThemeFontSize {
	family: string;
}

export interface ThemeFont {
	family: string;
	sizes: {
		xs: ThemeFontSize;
		sm: ThemeFontSize;
		md: ThemeFontSize;
		lg: ThemeFontSize;
		xl: ThemeFontSize;
	};
}

export type ThemeFontSizeNames = keyof ThemeFont["sizes"];

export type ThemeFontNames = keyof Omit<ThemeTypography, "base" | "color">;

export type ThemeFonts =
	| `${ThemeFontNames}.${ThemeFontSizeNames}`
	| ThemeFontNames;

export interface ThemeFontConfig {
	family: string;
	sizes: {
		xs: ThemeFontSize;
		sm: ThemeFontSize;
		md: ThemeFontSize;
		lg: ThemeFontSize;
		xl: ThemeFontSize;
	};
}

export interface ThemeTypography {
	base: number;
	color: {
		light: ThemeTypographyColors;
		dark: ThemeTypographyColors;
	};
	primary: ThemeFont;
	secondary: ThemeFont;
}

export type ThemeTypographyName = keyof Omit<ThemeTypography, "base" | "color">;

export interface ThemeTypographyColors {
	primary: string;
	secondary: string;
	disabled: string;
}

export type ThemeTypographyColorNames = keyof ThemeTypographyColors;

export interface ThemeTypographyConfig {
	base?: number;
	color?: {
		light: ThemeTypographyColors;
		dark: ThemeTypographyColors;
	};
	primary?: ThemeFont;
	secondary?: ThemeFont;
}

export interface ThemeBreakpoints {
	xs: number;
	sm: number;
	md: number;
	lg: number;
	xl: number;
}

export interface ThemeBreakpointsConfig {
	xs?: number;
	sm?: number;
	md?: number;
	lg?: number;
	xl?: number;
}

export interface ThemeShadows {
	xs: string;
	sm: string;
	md: string;
	lg: string;
	xl: string;
}

export interface ThemeShadowsConfig {
	xs?: string;
	sm?: string;
	md?: string;
	lg?: string;
	xl?: string;
}

export type ThemeOverride<
	Classes extends CSSClasses = {},
	Props extends object | undefined = undefined
> = (
	theme: Theme,
	props: Props
) => {
	[key in keyof Classes]?: StylesValue;
};

export interface ThemeOverrides {
	CSSBase?: ThemeOverride<CSSBaseClasses, undefined>;
	Gap?: ThemeOverride<GapClasses, GapProps>;
	Prose?: ThemeOverride<ProseClasses, ProseProps>;
	Surface?: ThemeOverride<SurfaceClasses, SurfaceProps>;
	Loading?: ThemeOverride<LoadingClasses, LoadingProps>;
	TextButton?: ThemeOverride<TextButtonClasses, TextButtonProps>;
	FilledButton?: ThemeOverride<FilledButtonClasses, FilledButtonProps>;
	OutlinedButton?: ThemeOverride<OutlinedButtonClasses, OutlinedButtonProps>;
	IconButton?: ThemeOverride<IconButtonClasses, IconButtonProps>;
	TextInput?: ThemeOverride<InputClasses, InputProps>;
}

export type ThemeOverridesConfig = Partial<ThemeOverrides>;

export type ThemeSpaceHelper = (size: number) => number;

export type ThemeRoundHelper = (size: keyof ThemeRounding) => number;

export type ThemeShadowHelper = (name: keyof ThemeShadows) => string;

export type ThemeColorHelperRawOptions = {
	raw: true;
	mode: ThemeMode;
};
export type ThemeColorHelperVariantOptions<Color extends ThemeColorName> = {
	variant: Color extends `${infer Name}.${infer Variant}`
		? Name extends ThemePaletteColorName
			? keyof ThemePalette[Name]
			: never
		: Color extends ThemePaletteColorName
		? keyof ThemePalette[Color]
		: never;
};
export type ThemeColorHelper = <
	Color extends ThemeColorName,
	Options extends
		| ThemeColorHelperRawOptions
		| ThemeColorHelperVariantOptions<Color>
		| undefined = undefined
>(
	name: Color,
	options?: Options
) => Options extends undefined
	? Color extends `${infer Name}.${infer Variant}`
		? `var(--ui-color-${Name}-${Variant})`
		: `var(--ui-color-${Color})`
	: Options extends ThemeColorHelperVariantOptions<Color>
	? Color extends `${infer Name}.${infer Variant}`
		? `var(--ui-color-${Name}.${Options["variant"]})`
		: Color extends ThemePaletteColorName
		? `var(--ui-color-${Color}.${Options["variant"]})`
		: never
	: string;

export type ThemeFontHelper = <Font extends ThemeFonts>(
	name: Font
) => {
	family: string;
	size: number;
	weight: number;
	height: number;
};

export type ThemeTextHelperRawOptions = {
	raw: true;
	mode: ThemeMode;
};
export type ThemeTextHelper = <
	Color extends ThemeTypographyColorNames,
	Options extends ThemeTextHelperRawOptions
>(
	name: Color,
	options?: Options
) => Options extends undefined ? `var(--ui-text-${Color})` : string;

export interface Theme {
	spacing: number;
	rounding: ThemeRounding;
	breakpoints: ThemeBreakpoints;
	typography: ThemeTypography;
	palette: {
		light: ThemePalette;
		dark: ThemePalette;
	};
	shadows: {
		light: ThemeShadows;
		dark: ThemeShadows;
	};
	overrides: ThemeOverrides;
	space: ThemeSpaceHelper;
	round: ThemeRoundHelper;
	shadow: ThemeShadowHelper;
	color: ThemeColorHelper;
	font: ThemeFontHelper;
	text: ThemeTextHelper;
}

export interface ThemeConfig {
	spacing?: number;
	rounding?: ThemeRoundingConfig;
	breakpoints?: ThemeBreakpointsConfig;
	typography?: ThemeTypographyConfig;
	palette?: {
		light: ThemePaletteConfig;
		dark: ThemePaletteConfig;
	};
	shadows?: {
		light: ThemeShadowsConfig;
		dark: ThemeShadowsConfig;
	};
	overrides?: ThemeOverridesConfig;
}
