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
	light?: string;
	main: string;
	dark?: string;
	text?: string;
}

export interface ThemePalette {
	primary: ThemePaletteColor;
	secondary: ThemePaletteColor;
	background: ThemePaletteColor;
	disabled: ThemePaletteColor;
}

export type ThemePaletteColorNames = keyof ThemePalette;

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
	color: ThemeTypographyColor;
	primary: ThemeFont;
	secondary: ThemeFont;
}

export type ThemeTypographyName = keyof Omit<ThemeTypography, "base" | "color">;

export interface ThemeTypographyColor {
	primary: string;
	secondary: string;
	disabled: string;
}

export interface ThemeTypographyConfig {
	base?: number;
	color?: ThemeTypographyColor;
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
	Props extends object = {}
> = (input: CSSFactoryInput, props: Props) => Partial<Classes>;

export interface ThemeOverrides {
	Gap?: ThemeOverride<GapClasses, GapProps>;
	Prose?: ThemeOverride<ProseClasses, ProseProps>;
	Surface?: ThemeOverride<SurfaceClasses, SurfaceProps>;
	Loading?: ThemeOverride<LoadingClasses, LoadingProps>;
	TextButton?: ThemeOverride<TextButtonClasses, TextButtonProps>;
	FilledButton?: ThemeOverride<FilledButtonClasses, FilledButtonProps>;
	OutlinedButton?: ThemeOverride<OutlinedButtonClasses, OutlinedButtonProps>;
	IconButton?: ThemeOverride<IconButtonClasses, IconButtonProps>;
}

export type ThemeOverridesConfig = Partial<ThemeOverrides>;

export interface Theme {
	spacing: number;
	rounding: ThemeRounding;
	palette: ThemePalette;
	typography: ThemeTypography;
	breakpoints: ThemeBreakpoints;
	shadows: ThemeShadows;
	overrides: ThemeOverrides;
}

export interface ThemeConfig {
	spacing?: number;
	rounding?: ThemeRoundingConfig;
	palette?: ThemePaletteConfig;
	typography?: ThemeTypographyConfig;
	breakpoints?: ThemeBreakpointsConfig;
	shadows?: ThemeShadowsConfig;
	overrides?: ThemeOverridesConfig;
}

export interface ThemeSpec {
	light?: ThemeConfig;
	dark?: ThemeConfig;
}
