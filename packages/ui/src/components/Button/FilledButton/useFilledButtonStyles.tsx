import useCSS from "../../../hooks/useCSS";
import { CSSClass } from "../../../types/css";
import {
	ThemeFont,
	ThemePaletteColor,
	ThemePaletteColorNames,
} from "../../../types/theme";
import { ButtonBaseProps } from "../../ButtonBase";

export type Size = "sm" | "md" | "lg" | "xl";

export interface FilledButtonStylesOptions {
	color: NonNullable<ButtonBaseProps["color"]>;
	disabled: NonNullable<ButtonBaseProps["disabled"]>;
}

const useFilledButtonStyles = ({
	color,
	disabled,
}: FilledButtonStylesOptions) => {
	const classes = useCSS(({ css, theme, util }) => {
		const themeColor =
			color === "text" ? util.color("background") : util.color(color);

		const disabledColor = util.color("disabled");

		return {
			root: css({
				color: themeColor.text,
				background: themeColor.main,
				boxShadow: util.shadow("sm"),
				transition: "background 150ms linear, box-shadow 150ms linear",

				"&:hover": {
					background: util.lighten(themeColor.main, 8),
				},

				"&:active": {
					background: util.darken(themeColor.main, 2),
					transition:
						"background 115ms linear, box-shadow 115ms linear",
				},
			}),
			float: css({
				transform: "scale(1) translateY(0)",
				boxShadow: util.shadow("md"),
				transition:
					"transform 150ms linear, background 150ms linear, box-shadow 150ms linear",

				"&:hover": {
					transform: `scale(1) translateY(${util.space(-0.5)}px)`,
					background: util.lighten(themeColor.main, 8),
					boxShadow: disabled ? util.shadow("md") : util.shadow("lg"),
				},

				"&:active": {
					transition:
						"transform 115ms linear, background 115ms linear, box-shadow 115ms linear",
					transform: `scale(1) translateY(${util.space(0.25)}px)`,
					background: util.darken(themeColor.main, 2),
					boxShadow: disabled ? util.shadow("md") : util.shadow("xs"),
				},
			}),
			disabled: css({
				color: disabledColor.text,
				background: disabledColor.main,
				transform: "none",

				"&:hover": {
					color: disabledColor.text,
					background: disabledColor.main,
					transform: "none",
				},

				"&:active": {
					color: disabledColor.text,
					background: disabledColor.main,
					transform: "none",
				},
			}),
			dot: css({
				background: disabled ? disabledColor.text : themeColor.text,
			}),
		};
	});

	return classes;
};

export default useFilledButtonStyles;
