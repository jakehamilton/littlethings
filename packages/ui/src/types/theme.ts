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

export type ThemeOverride = () => void;

export interface ThemeOverrides {
	[key: string]: ThemeOverride;
}

export interface ThemeOverridesConfig {
	[key: string]: ThemeOverride;
}

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
