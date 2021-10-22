import useCSS from "../../../hooks/useCSS";
import { ButtonBaseProps } from "../../ButtonBase";

export interface TextButtonStylesOptions {
	color: NonNullable<ButtonBaseProps["color"]>;
	disabled: NonNullable<ButtonBaseProps["disabled"]>;
}

const useTextButtonStyles = (
	color: TextButtonStylesOptions["color"],
	disabled: TextButtonStylesOptions["disabled"]
) => {
	const classes = useCSS(
		"TextButton",
		({ css, theme, util }) => {
			const themeColor =
				color === "text" || color === "background"
					? {
							light: theme.typography.color.primary,
							main: theme.typography.color.primary,
							dark: theme.typography.color.primary,
							text: theme.typography.color.primary,
					  }
					: util.color(color);

			const disabledColor = util.color("disabled");

			return {
				root: css({
					color: themeColor.main,
				}),
				disabled: css({
					color: disabledColor.text,
				}),
				dot: css({
					background: disabled ? disabledColor.text : themeColor.main,
				}),
			};
		},
		[color, disabled]
	);

	return classes;
};

export default useTextButtonStyles;
