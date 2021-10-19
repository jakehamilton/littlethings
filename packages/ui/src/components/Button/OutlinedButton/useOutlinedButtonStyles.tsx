import useCSS from "../../../hooks/useCSS";
import { ButtonBaseProps } from "../../ButtonBase";

export interface OutlinedButtonStylesOptions {
	color: NonNullable<ButtonBaseProps["color"]>;
	disabled: NonNullable<ButtonBaseProps["disabled"]>;
}

const useOutlinedButtonStyles = ({
	color,
	disabled,
}: OutlinedButtonStylesOptions) => {
	const classes = useCSS(
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
					border: `2px solid ${themeColor.main}`,
				}),
				disabled: css({
					color: disabledColor.text,
					border: `2px solid ${disabledColor.text}`,
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

export default useOutlinedButtonStyles;
