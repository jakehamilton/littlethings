import { ComponentChildren } from "preact";
import useCSS from "../../hooks/useCSS";
import {
	ThemeColorName,
	ThemeFont,
	ThemePaletteColor,
	ThemePaletteColorName,
} from "../../types/theme";

export interface ButtonBaseStylesOptions {
	color: ThemeColorName | ThemePaletteColor | "text";
	size: Size;
	loading: boolean;
	disabled: boolean;
	hasPrefixIcon?: boolean;
	hasPostfixIcon?: boolean;
}

const useButtonBaseStyles = (
	color: ButtonBaseStylesOptions["color"],
	size: ButtonBaseStylesOptions["size"],
	loading: ButtonBaseStylesOptions["loading"],
	disabled: ButtonBaseStylesOptions["disabled"],
	hasPrefixIcon: ButtonBaseStylesOptions["hasPrefixIcon"],
	hasPostfixIcon: ButtonBaseStylesOptions["hasPostfixIcon"]
) => {
	const classes = useCSS(
		useButtonBaseStyles,
		({ css, theme, util }) => {
			const themeColor =
				color === "text" ? util.color("background") : util.color(color);

			const padding = getPadding(size, hasPrefixIcon, hasPostfixIcon);

			const font = util.font("primary");

			const fontSize = font.sizes[getFontSize(size)];

			const focusRingColor =
				color === "text" || color === "background"
					? theme.typography.color.primary
					: themeColor.main;

			return {
				root: css({}),
				container: css({
					position: "relative",
				}),
				loading: css({}),
				content: css({}),
				prefixIcon: css({}),
				postfixIcon: css({}),
			};
		},
		[color, size, loading, disabled, hasPrefixIcon, hasPostfixIcon]
	);

	return classes;
};

export default useButtonBaseStyles;
