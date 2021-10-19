import {
	Theme,
	ThemeBreakpoints,
	ThemeConfig,
	ThemeMode,
	ThemePalette,
	ThemePaletteColor,
	ThemePaletteConfig,
	ThemeRounding,
	ThemeSpec,
	ThemeTypography,
	ThemeTypographyColor,
} from "../types/theme";

import White from "../colors/white";
import Black from "../colors/black";
import Light from "../colors/light";
import Dark from "../colors/dark";
import Gray from "../colors/gray";
import Purple from "../colors/purple";
import tinycolor from "tinycolor2";
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

const DEFAULT_LIGHT_TYPOGRAPHY_COLORS: ThemeTypographyColor = {
	primary: Black["200"],
	secondary: Gray["600"],
	disabled: Gray["400"],
};

const DEFAULT_DARK_TYPOGRAPHY_COLORS: ThemeTypographyColor = {
	primary: White["900"],
	secondary: Light["700"],
	disabled: Gray["400"],
};

const DEFAULT_TYPOGRAPHY: Omit<ThemeTypography, "color"> = {
	base: 14,
	primary: {
		family:
			"Inter, Helvetica Neue, Helvetica, -apple-system, Arial, sans-serif",
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
		family:
			"Staatliches, Helvetica Neue, Helvetica, -apple-system, Arial, sans-serif",
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
		dark: Light["600"],
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
		light: Gray["300"],
		main: Gray["500"],
		dark: Gray["700"],
		text: Gray["900"],
	},
};

const normalizePalette = (
	palette: ThemePaletteConfig | undefined,
	background: ThemePaletteColor
): ThemePalette | undefined => {
	if (palette === undefined) {
		return palette;
	}

	const normalized = {} as ThemePalette;

	for (const _key in palette) {
		const key = _key as keyof ThemePaletteConfig;

		if (palette.hasOwnProperty(key)) {
			const color = palette[key];

			if (color === undefined) {
				continue;
			}

			const { main, light, dark, text } = color;

			if (light === undefined) {
				color.light = "#" + tinycolor(main).lighten().toHex();
			}

			if (dark === undefined) {
				color.dark = "#" + tinycolor(main).darken().toHex();
			}

			if (text === undefined) {
				color.text =
					"#" +
					tinycolor
						.mostReadable(main, [
							background.text,
							Black["900"],
							White["900"],
						])
						.toHex();
			}

			normalized[key] = color as ThemePaletteColor;
		}
	}

	return normalized;
};

const configToTheme = (
	config: ThemeConfig | undefined,
	mode: ThemeMode
): Theme => {
	const theme: Theme = {
		spacing: config?.spacing ?? DEFAULT_SPACING,
		rounding: {
			...DEFAULT_ROUNDING,
			...config?.rounding,
		},
		palette: {
			...(mode === "dark" ? DEFAULT_DARK_PALETTE : DEFAULT_LIGHT_PALETTE),
			...normalizePalette(
				config?.palette,
				mode === "dark"
					? DEFAULT_DARK_PALETTE.background
					: DEFAULT_LIGHT_PALETTE.background
			),
		},
		breakpoints: {
			...DEFAULT_BREAKPOINTS,
			...config?.breakpoints,
		},
		shadows: {
			...DEFAULT_SHADOWS,
			...config?.shadows,
		},
		typography: {
			...DEFAULT_TYPOGRAPHY,
			...config?.typography,
			color: {
				...(mode === "dark"
					? DEFAULT_DARK_TYPOGRAPHY_COLORS
					: DEFAULT_LIGHT_TYPOGRAPHY_COLORS),
				...config?.typography?.color,
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
	};

	return theme;
};

export const createTheme = (spec?: ThemeSpec) => {
	const light = configToTheme(spec?.light, "light");
	const dark = configToTheme(spec?.dark, "dark");

	return { light, dark } as const;
};
