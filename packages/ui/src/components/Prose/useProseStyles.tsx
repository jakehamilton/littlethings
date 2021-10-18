import useCSS from "../../hooks/useCSS";
import {
	ThemeFontSizeNames,
	ThemePaletteColor,
	ThemePaletteColorNames,
	ThemeTypographyColor,
	ThemeTypographyName,
} from "../../types/theme";

export interface ProseStylesConfig {
	color?: ThemePaletteColorNames | ThemePaletteColor;
	variant?: keyof ThemeTypographyColor;
	font: ThemeTypographyName;
	size: ThemeFontSizeNames;
}

const useProseStyles = ({ color, variant, font, size }: ProseStylesConfig) => {
	const classes = useCSS(({ css, theme, util }) => {
		const themeColor = color
			? util.color(color)
			: variant === "primary"
			? {
					main: theme.typography.color.primary,
			  }
			: variant === "secondary"
			? {
					main: theme.typography.color.secondary,
			  }
			: undefined;

		const themeFont = util.font(font);

		const sizeVariant = themeFont.sizes[size];

		return {
			root: css`
				${themeColor ? `color: ${themeColor.main};` : ""}

				font-family: ${themeFont.family};
				font-size: ${sizeVariant.size}rem;
				font-weight: ${sizeVariant.weight};
				line-height: ${sizeVariant.height};
			`,
		};
	});

	return classes;
};

export default useProseStyles;
