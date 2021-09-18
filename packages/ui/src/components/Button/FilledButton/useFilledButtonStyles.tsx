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
	size: Size;
}

const useFilledButtonStyles = ({
	color,
	disabled,
	size,
}: FilledButtonStylesOptions) => {
	const classes = useCSS(({ css, theme, util }) => {
		const themeColor = util.color(color);

		return {
			root: css`
				color: ${themeColor.text};
				background: ${themeColor.main};

				box-shadow: ${util.shadow("sm")};

				transform: translateY(0);
				transition: transform 150ms ease-out, background 150ms ease-out,
					box-shadow 150ms ease-out;

				&:hover {
					transform: translateY(${util.space(-0.25)}px);
					background: ${util.lighten(themeColor.main, 8)};
					box-shadow: ${util.shadow("md")};
				}

				&:active {
					background: ${util.darken(themeColor.main, 2)};
					box-shadow: ${util.shadow("xs")},
						inset 0 2px 10px rgba(0, 0, 0, 0.075);
					transform: translateY(${util.space(0.25)}px);
				}
			`,
		};
	});

	return classes;
};

export default useFilledButtonStyles;
