import useCSS from "../../hooks/useCSS";
import {
	ThemePaletteColor,
	ThemePaletteColorNames,
	ThemeShadows,
} from "../../types/theme";

export interface SurfaceStylesOptions {
	color: ThemePaletteColorNames | ThemePaletteColor;
	variant: keyof Omit<ThemePaletteColor, "text">;
	elevation: keyof ThemeShadows | "none";
}

const useSurfaceStyles = ({
	color,
	variant,
	elevation,
}: SurfaceStylesOptions) => {
	const classes = useCSS(({ css, util }) => {
		const themeColor =
			typeof color === "string" ? util.color(color) : color;

		const shadow = elevation === "none" ? "none" : util.shadow(elevation);

		return {
			root: css`
				color: ${themeColor.text};
				background: ${themeColor[variant]};
				box-shadow: ${shadow};
			`,
		};
	});

	return classes;
};

export default useSurfaceStyles;
