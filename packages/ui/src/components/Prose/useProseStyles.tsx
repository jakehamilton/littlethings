import useCSS from "../../hooks/useCSS";
import {
	ThemeColorName,
	ThemeFontSizeNames,
	ThemePaletteColor,
	ThemePaletteColorName,
	ThemeTypographyColor,
	ThemeTypographyName,
} from "../../types/theme";

export interface ProseStylesConfig {
	color?: ThemeColorName | ThemePaletteColor;
	variant?: keyof ThemeTypographyColor;
	font: ThemeTypographyName;
	size: ThemeFontSizeNames;
}

const useProseStyles = (
	color: ProseStylesConfig["color"],
	variant: ProseStylesConfig["variant"],
	font: ProseStylesConfig["font"],
	size: ProseStylesConfig["size"]
) => {
	const classes = useCSS(
		useProseStyles,
		({ css, theme, util }) => {
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
				root: css({
					color: themeColor ? themeColor.main : "currentColor",

					fontFamily: themeFont.family,
					fontSize: `${sizeVariant.size}rem`,
					fontWeight: String(sizeVariant.weight),
					lineHeight: `${sizeVariant.height}rem`,
				}),
			};
		},
		[color, variant, font, size]
	);

	return classes;
};

export default useProseStyles;
