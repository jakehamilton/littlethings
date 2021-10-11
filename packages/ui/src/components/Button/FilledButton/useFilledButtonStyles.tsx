import useCSS from "../../../hooks/useCSS";
import {
	ThemeFont,
	ThemePaletteColor,
	ThemePaletteColorNames,
} from "../../../types/theme";

export type Size = "sm" | "md" | "lg" | "xl";

export interface FilledButtonStylesOptions {
	color: ThemePaletteColorNames | ThemePaletteColor;
	disabled: boolean;
}

const useFilledButtonStyles = ({
	color,
	disabled,
}: FilledButtonStylesOptions) => {
	const classes = useCSS(({ css, theme, util }) => {
		const themeColor = util.color(color);
		const disabledColor = util.color("disabled");

		return {
			root: css`
				color: ${themeColor.text};
				background: ${themeColor.main};

				box-shadow: ${util.shadow("sm")};

				transition: background 150ms linear, box-shadow 150ms linear;

				&:hover {
					background: ${util.lighten(themeColor.main, 8)};
				}

				&:active {
					background: ${util.darken(themeColor.main, 2)};
					transition: background 115ms linear, box-shadow 115ms linear;
				}
			`,
			float: css`
				transform: scale(1) translateY(0);

				box-shadow: ${util.shadow("md")};

				transition: transform 150ms linear, background 150ms linear,
					box-shadow 150ms linear;

				&:hover {
					transform: scale(1) translateY(${util.space(-0.5)}px);
					background: ${util.lighten(themeColor.main, 8)};
					box-shadow: ${disabled
						? util.shadow("md")
						: util.shadow("lg")};
				}

				&:active {
					transition: transform 115ms linear, background 115ms linear,
						box-shadow 115ms linear;
					transform: scale(1) translateY(${util.space(0.25)}px);
					background: ${util.darken(themeColor.main, 2)};
					box-shadow: ${disabled
						? util.shadow("md")
						: util.shadow("xs")};
				}
			`,
			disabled: css`
				color: ${disabledColor.text};
				background: ${disabledColor.main};

				transform: none;

				&:hover {
					color: ${disabledColor.text};
					background: ${disabledColor.main};
					transform: none;
				}

				&:active {
					color: ${disabledColor.text};
					background: ${disabledColor.main};
					transform: none;
				}
			`,
			dot: css`
				background: ${disabled ? disabledColor.text : themeColor.text};
			`,
		};
	});

	return classes;
};

export default useFilledButtonStyles;
