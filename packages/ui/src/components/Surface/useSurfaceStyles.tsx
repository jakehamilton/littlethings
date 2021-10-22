import useCSS from "../../hooks/useCSS";
import {
	ThemeColorName,
	ThemePaletteColor,
	ThemePaletteColorName,
	ThemeShadows,
} from "../../types/theme";

export interface SurfaceStylesOptions {
	color: ThemeColorName | ThemePaletteColor;
	variant: keyof Omit<ThemePaletteColor, "text">;
	elevation: keyof ThemeShadows | "none";
}

const useSurfaceStyles = (
	color: SurfaceStylesOptions["color"],
	variant: SurfaceStylesOptions["variant"],
	elevation: SurfaceStylesOptions["elevation"]
) => {
	const classes = useCSS(
		"Surface",
		({ css, util }) => {
			const themeColor =
				typeof color === "string" ? util.color(color) : color;

			const shadow =
				elevation === "none" ? "none" : util.shadow(elevation);

			return {
				root: css({
					color: themeColor.text,
					background: themeColor[variant],
					boxShadow: shadow,
				}),
			};
		},
		[color, variant, elevation]
	);

	return classes;
};

export default useSurfaceStyles;
