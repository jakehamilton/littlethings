import useCSS from "../../hooks/useCSS";
import { ThemeShadows } from "../../types/theme";

export interface SurfaceStylesOptions {
	elevation?: keyof ThemeShadows | "none";
}

const useSurfaceStyles = ({ elevation = "none" }: SurfaceStylesOptions) => {
	const classes = useCSS(({ css, util }) => {
		const shadow = elevation === "none" ? "none" : util.shadow(elevation);

		return {
			root: css`
				box-shadow: ${shadow};
			`,
		};
	});

	return classes;
};

export default useSurfaceStyles;
