import { ThemeColorName, ThemePaletteColor, useCSS } from "../..";

export interface TextInputStylesOptions {
	color: ThemeColorName | ThemePaletteColor;
	focus: ThemeColorName | ThemePaletteColor;
	border: ThemeColorName | ThemePaletteColor;
	prefixIcon: boolean;
	postfixIcon: boolean;
}

const useTextInputStyles = (
	color: TextInputStylesOptions["color"],
	focus: TextInputStylesOptions["focus"],
	border: TextInputStylesOptions["border"],
	prefixIcon: TextInputStylesOptions["prefixIcon"],
	postfixIcon: TextInputStylesOptions["postfixIcon"]
) => {
	const classes = useCSS(
		useTextInputStyles,
		({ css, util }) => {
			const themeColor = util.color(color);
			const focusColor = util.color(focus);
			const borderColor = util.color(border);
			const disabledColor = util.color("disabled");

			const rounding = util.round("sm");

			const font = util.font("primary");

			const fontVariant = font.sizes.xs;

			let gridTemplate;

			if (prefixIcon && postfixIcon) {
				gridTemplate = "1fr / 1fr min-content 1fr";
			} else if (prefixIcon) {
				gridTemplate = "1fr / min-content 1fr";
			} else if (postfixIcon) {
				gridTemplate = "1fr / 1fr min-content";
			} else {
				gridTemplate = "1fr / 1fr";
			}

			const icon = css({
				position: "relative",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				color: borderColor.text,
				padding: `${util.space(1)}px`,
				background: borderColor.main,
				height: `100%`,
			});

			const input = css({
				position: "relative",
				display: "block",
				width: "100%",
				minWidth: "250px",
				minHeight: "36px",
				border: "none",
				outline: "none",
				padding: `${util.space(1)}px ${util.space(1.5)}px`,

				color: themeColor.text,
				background: themeColor.main,

				fontFamily: font.family,
				fontSize: `${fontVariant.size}rem`,
				fontWeight: String(fontVariant.weight),
				lineHeight: `${fontVariant.height}rem`,
			});

			return {
				root: css({
					display: "inline-grid",
					gridTemplate,
					border: `2px solid ${borderColor.main}`,
					borderRadius: `${rounding}px`,
					overflow: "hidden",

					"&:focus-within": {
						borderColor: focusColor.main,

						[`.${icon}`]: {
							color: focusColor.text,
							background: focusColor.main,
						},
					},
				}),

				input,
				icon,

				disabled: css({
					color: disabledColor.text,
					background: disabledColor.main,
					borderColor: disabledColor.main,

					[`& .${icon}`]: {
						color: disabledColor.text,
						background: disabledColor.main,
					},
				}),
			};
		},
		[color, focus, border, prefixIcon, postfixIcon]
	);

	return classes;
};

export default useTextInputStyles;
