import useCSS from "../../hooks/useCSS";
import {
	ThemeColorName,
	ThemePaletteColor,
	ThemePaletteColorName,
	ThemeShadows,
} from "../../types/theme";

export interface SurfaceStylesOptions {
	color: ThemeColorName;
	elevation: keyof ThemeShadows | "none";
}

const useSurfaceStyles = (
	color: SurfaceStylesOptions["color"],
	elevation: SurfaceStylesOptions["elevation"]
) => {
	const classes = useCSS(
		useSurfaceStyles,
		({ css, util }) => {
			const themeColor = util.color(color);

			const shadow =
				elevation === "none" ? "none" : util.shadow(elevation);

			return {
				root: css({
					color: themeColor.text,
					background: themeColor.main,
					boxShadow: shadow,
				}),
			};
		},
		[color, elevation]
	);

	return classes;
};

export default useSurfaceStyles;
