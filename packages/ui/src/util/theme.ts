import {
	Theme,
	ThemeBreakpoints,
	ThemePalette,
	ThemePaletteColor,
	ThemeRounding,
	ThemeConfig,
	ThemeTypography,
	ThemeTypographyColors,
	ThemeColorHelperRawOptions,
	ThemeColorHelperVariantOptions,
	ThemeColorName,
	ThemePaletteColorName,
	ThemeFontNames,
	ThemeFontSizeNames,
} from "../types/theme";

import White from "../colors/white";
import Black from "../colors/black";
import Light from "../colors/light";
import Dark from "../colors/dark";
import Gray from "../colors/gray";
import Purple from "../colors/purple";
import Orange from "../colors/orange";

const DEFAULT_SPACING: number = 8;

const DEFAULT_ROUNDING: ThemeRounding = {
	xs: 2,
	sm: 4,
	md: 8,
	lg: 12,
	xl: 18,
};

const DEFAULT_BREAKPOINTS: ThemeBreakpoints = {
	xs: 0,
	sm: 600,
	md: 960,
	lg: 1280,
	xl: 1920,
};

const DEFAULT_LIGHT_TYPOGRAPHY_COLORS: ThemeTypographyColors = {
	primary: Black["200"],
	secondary: Gray["600"],
	disabled: Gray["400"],
};

const DEFAULT_DARK_TYPOGRAPHY_COLORS: ThemeTypographyColors = {
	primary: White["900"],
	secondary: Light["700"],
	disabled: Gray["400"],
};

const DEFAULT_TYPOGRAPHY: Omit<ThemeTypography, "color"> = {
	base: 14,
	primary: {
		family: "Inter, Helvetica Neue, Helvetica, -apple-system, Arial, sans-serif",
		sizes: {
			xs: {
				size: 1,
				height: 1.14,
				weight: 400,
			},
			sm: {
				size: 1.125,
				height: 1.42,
				weight: 500,
			},
			md: {
				size: 1.24,
				height: 1.71,
				weight: 600,
			},
			lg: {
				size: 1.52,
				height: 2,
				weight: 700,
			},
			xl: {
				size: 1.71,
				height: 2.28,
				weight: 800,
			},
		},
	},
	secondary: {
		family: "Staatliches, Helvetica Neue, Helvetica, -apple-system, Arial, sans-serif",
		sizes: {
			xs: {
				size: 1,
				height: 1.14,
				weight: 400,
			},
			sm: {
				size: 1.125,
				height: 1.42,
				weight: 500,
			},
			md: {
				size: 1.24,
				height: 1.71,
				weight: 600,
			},
			lg: {
				size: 1.52,
				height: 2,
				weight: 700,
			},
			xl: {
				size: 1.71,
				height: 2.28,
				weight: 800,
			},
		},
	},
};

const DEFAULT_SHADOWS = {
	xs: "0 1px 6px -2px rgba(0, 0, 0, 0.15)",
	sm: "0 1px 10px -2px rgba(0, 0, 0, 0.15)",
	md: "0 4px 18px -3px rgba(0, 0, 0, 0.2)",
	lg: "0 10px 30px -4px rgba(0, 0, 0, 0.22)",
	xl: "0 16px 42px -1px rgba(0, 0, 0, 0.2)",
};

const DEFAULT_STATUS_COLORS = {};

const DEFAULT_LIGHT_PALETTE: ThemePalette = {
	...DEFAULT_STATUS_COLORS,
	background: {
		light: Light["50"],
		main: Light["200"],
		dark: Gray["200"],
		text: Black["700"],
	},
	primary: {
		light: Purple["300"],
		main: Purple["500"],
		dark: Purple["700"],
		text: White["900"],
	},
	secondary: {
		light: Orange["300"],
		main: Orange["500"],
		dark: Orange["700"],
		text: White["900"],
	},
	disabled: {
		light: Gray["100"],
		main: Gray["200"],
		dark: Gray["600"],
		text: Gray["400"],
	},
};

const DEFAULT_DARK_PALETTE: ThemePalette = {
	...DEFAULT_STATUS_COLORS,
	background: {
		light: Dark["100"],
		main: Dark["400"],
		dark: Dark["700"],
		text: White["900"],
	},
	primary: {
		light: Purple["300"],
		main: Purple["500"],
		dark: Purple["700"],
		text: White["900"],
	},
	secondary: {
		light: Orange["300"],
		main: Orange["500"],
		dark: Orange["700"],
		text: White["900"],
	},
	disabled: {
		light: Black["50"],
		main: Black["100"],
		dark: Black["400"],
		text: White["300"],
	},
};

const isThemeColorHelperRawOptions = (
	options: any
): options is ThemeColorHelperRawOptions => {
	return options !== null && typeof options === "object" && options.raw;
};

const isThemeColorHelperVariantOptions = <Color extends ThemeColorName>(
	options: any
): options is ThemeColorHelperVariantOptions<Color> => {
	return options !== null && typeof options === "object" && options.variant;
};

export const createTheme = (config: ThemeConfig = {}): Theme => {
	const theme: Theme = {
		spacing: config?.spacing ?? DEFAULT_SPACING,
		rounding: {
			...DEFAULT_ROUNDING,
			...config?.rounding,
		},
		palette: {
			light: {
				...DEFAULT_LIGHT_PALETTE,
				...config?.palette?.light,
			},
			dark: {
				...DEFAULT_DARK_PALETTE,
				...config?.palette?.dark,
			},
		},
		breakpoints: {
			...DEFAULT_BREAKPOINTS,
			...config?.breakpoints,
		},
		shadows: {
			light: {
				...DEFAULT_SHADOWS,
				...config?.shadows?.light,
			},
			dark: {
				...DEFAULT_SHADOWS,
				...config?.shadows?.dark,
			},
		},
		typography: {
			...DEFAULT_TYPOGRAPHY,
			...config?.typography,
			color: {
				light: {
					...DEFAULT_LIGHT_TYPOGRAPHY_COLORS,
					...config?.typography?.color?.light,
				},
				dark: {
					...DEFAULT_LIGHT_TYPOGRAPHY_COLORS,
					...config?.typography?.color?.dark,
				},
			},
			primary: {
				...DEFAULT_TYPOGRAPHY.primary,
				...config?.typography?.primary,
				sizes: {
					...DEFAULT_TYPOGRAPHY.primary.sizes,
					...config?.typography?.primary?.sizes,
				},
			},
			secondary: {
				...DEFAULT_TYPOGRAPHY.secondary,
				...config?.typography?.secondary,
				sizes: {
					...DEFAULT_TYPOGRAPHY.secondary.sizes,
					...config?.typography?.secondary?.sizes,
				},
			},
		},
		overrides: {
			...config?.overrides,
		},
		space(size) {
			return this.spacing * size;
		},
		round(size) {
			return this.rounding[size];
		},
		shadow(name) {
			return `var(--ui-shadow-${name})`;
		},
		// @ts-expect-error
		color(name, options) {
			if (isThemeColorHelperRawOptions(options)) {
				const [key, variant = "main"] = name.split(".");

				return this.palette[options.mode][key as keyof ThemePalette][
					variant as keyof ThemePaletteColor
				];
			} else if (isThemeColorHelperVariantOptions(options)) {
				const [key] = name.split(".");

				return `var(--ui-color-${key as ThemePaletteColorName}-${
					options.variant
				})`;
			} else {
				const [key, variant = "main"] = name.split(".");

				return `var(--ui-color-${key as ThemePaletteColorName}-${
					variant as keyof ThemePaletteColor
				})`;
			}
		},
		font(name) {
			const [key, variant = "sm"] = name.split(".");

			const font = this.typography[key as ThemeFontNames];
			const { size, weight, height } =
				font.sizes[variant as ThemeFontSizeNames];

			return {
				family: font.family,
				size,
				weight,
				height,
			};
		},
		// @ts-expect-error
		text(name, options) {
			if (options?.raw) {
				return this.typography.color[options.mode][name];
			} else {
				return `var(--ui-text-${name})`;
			}
		},
	};

	return theme;
};
