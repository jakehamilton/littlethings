import useCSS from "../../../hooks/useCSS";
import { ButtonBaseProps } from "../../ButtonBase";

export interface IconButtonStylesOptions {
	size: NonNullable<ButtonBaseProps["size"]>;
	color: NonNullable<ButtonBaseProps["color"]>;
	disabled: NonNullable<ButtonBaseProps["disabled"]>;
}

const getSize = (size: IconButtonStylesOptions["size"]): number => {
	switch (size) {
		case "sm":
			return 36;
		default:
		case "md":
			return 42;
		case "lg":
			return 52;
		case "xl":
			return 64;
	}
};

const useIconButtonStyles = (
	size: IconButtonStylesOptions["size"],
	color: IconButtonStylesOptions["color"],
	disabled: IconButtonStylesOptions["disabled"]
) => {
	const classes = useCSS(
		"IconButton",
		({ css, theme, util }) => {
			const elSize = getSize(size);

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
					borderRadius: "50%",
					width: `${elSize}px`,
					height: `${elSize}px`,
					padding: "0",

					"&::before": {
						borderRadius: "50%",
					},
				}),
				content: css({
					display: "inline-flex",
					alignItems: "center",
					justifyContent: "center",
					width: `${elSize}px`,
					height: `${elSize}px`,
					overflow: "hidden",
				}),
				disabled: css({
					color: disabledColor.text,
				}),
				dot: css({
					background: disabled ? disabledColor.text : themeColor.main,
				}),
			};
		},
		[size, color, disabled]
	);

	return classes;
};

export default useIconButtonStyles;
