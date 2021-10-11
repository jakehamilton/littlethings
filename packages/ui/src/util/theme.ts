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
import Emerald from "../colors/emerald";
import tinycolor from "tinycolor2";

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
	primary: Black["700"],
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
				size: 0.85,
				height: 1.14,
				weight: 400,
			},
			sm: {
				size: 1,
				height: 1.42,
				weight: 400,
			},
			md: {
				size: 1.14,
				height: 1.71,
				weight: 400,
			},
			lg: {
				size: 1.42,
				height: 2,
				weight: 500,
			},
			xl: {
				size: 1.71,
				height: 2.28,
				weight: 600,
			},
		},
	},
	secondary: {
		family:
			"Staatliches, Helvetica Neue, Helvetica, -apple-system, Arial, sans-serif",
		sizes: {
			xs: {
				size: 0.85,
				height: 1.14,
				weight: 400,
			},
			sm: {
				size: 1,
				height: 1.42,
				weight: 400,
			},
			md: {
				size: 1.14,
				height: 1.71,
				weight: 400,
			},
			lg: {
				size: 1.42,
				height: 1.42,
				weight: 500,
			},
			xl: {
				size: 1.71,
				height: 2.28,
				weight: 600,
			},
		},
	},
};

// const DEFAULT_SHADOWS = {
// 	xs:
// 		"0 1.1px 1.4px -49px rgba(0, 0, 0, 0.014), 0 2.5px 3.4px -49px rgba(0, 0, 0, 0.02), 0 4.8px 6.4px -49px rgba(0, 0, 0, 0.025), 0 8.5px 11.4px -49px rgba(0, 0, 0, 0.03), 0 15.9px 21.3px -49px rgba(0, 0, 0, 0.036), 0 38px 51px -49px rgba(0, 0, 0, 0.05)",
// 	sm:
// 		"0 1.1px 1.4px -13px rgba(0, 0, 0, 0.014), 0 2.5px 3.4px -13px rgba(0, 0, 0, 0.02), 0 4.8px 6.4px -13px rgba(0, 0, 0, 0.025), 0 8.5px 11.4px -13px rgba(0, 0, 0, 0.03), 0 15.9px 21.3px -13px rgba(0, 0, 0, 0.036), 0 38px 51px -13px rgba(0, 0, 0, 0.05)",
// 	md:
// 		"0 0.7px 1.1px rgba(0, 0, 0, 0.022), 0 1.6px 2.6px rgba(0, 0, 0, 0.032), 0 3px 4.9px rgba(0, 0, 0, 0.04), 0 5.4px 8.7px rgba(0, 0, 0, 0.048), 0 10px 16.3px rgba(0, 0, 0, 0.058), 0 24px 39px rgba(0, 0, 0, 0.08)",
// 	lg:
// 		"0 0.7px 4.5px rgba(0, 0, 0, 0.031), 0 1.6px 10.7px rgba(0, 0, 0, 0.044), 0 3px 20.2px rgba(0, 0, 0, 0.055), 0 5.4px 36px rgba(0, 0, 0, 0.066), 0 10px 67.3px rgba(0, 0, 0, 0.079), 0 24px 161px rgba(0, 0, 0, 0.11)",
// 	xl:
// 		"0 0.7px 10.4px rgba(0, 0, 0, 0.051), 0 1.6px 24.9px rgba(0, 0, 0, 0.073), 0 3px 47px rgba(0, 0, 0, 0.09), 0 5.4px 83.8px rgba(0, 0, 0, 0.107), 0 10px 156.7px rgba(0, 0, 0, 0.129), 0 24px 375px rgba(0, 0, 0, 0.18)",
// };
// const DEFAULT_SHADOWS = {
// 	xs:
// 		"0px 0.8px 5.6px -30px rgba(0, 0, 0, 0.139), 0px 2.7px 18.8px -30px rgba(0, 0, 0, 0.19), 0px 12px 84px -30px rgba(0, 0, 0, 0.3)",
// 	sm:
// 		"0px 2.9px 5.6px -30px rgba(0, 0, 0, 0.097), 0px 9.8px 18.8px -30px rgba(0, 0, 0, 0.133), 0px 44px 84px -30px rgba(0, 0, 0, 0.21)",
// 	md:
// 		"0px 5.9px 7.3px -30px rgba(0, 0, 0, 0.088), 0px 19.7px 24.6px -30px rgba(0, 0, 0, 0.12), 0px 88px 110px -30px rgba(0, 0, 0, 0.19)",
// 	lg:
// 		"0px 9.6px 10.5px -31px rgba(0, 0, 0, 0.071), 0px 32.4px 35.3px -31px rgba(0, 0, 0, 0.099), 0px 145px 158px -31px rgba(0, 0, 0, 0.16)",
// 	xl:
// 		"0px 12px 17.8px -31px rgba(0, 0, 0, 0.079), 0px 40.4px 59.6px -31px rgba(0, 0, 0, 0.112), 0px 181px 267px -31px rgba(0, 0, 0, 0.18)",
// };
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
		light: Emerald["300"],
		main: Emerald["500"],
		dark: Emerald["700"],
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
		light: Emerald["300"],
		main: Emerald["500"],
		dark: Emerald["700"],
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
