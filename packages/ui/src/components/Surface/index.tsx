import { clsx } from "@littlethings/css";
import { ThemeContextValue } from "../../contexts/Theme";
import { style, StyleUtil } from "../../theme/style";
import { CSSClass, CSSClasses } from "../../types/css";
import { Dynamic, dynamic } from "../Dynamic";
import useSurfaceStyles, { SurfaceStylesOptions } from "./useSurfaceStyles";

export interface SurfaceClasses extends CSSClasses {
	root: CSSClass;
}

export interface SurfaceProps {
	classes?: Partial<SurfaceClasses>;
	color?: SurfaceStylesOptions["color"];
	elevation?: SurfaceStylesOptions["elevation"];
}

const { useStyles, useOverrides, useClasses } = style(
	(theme: ThemeContextValue, util: StyleUtil, props: SurfaceProps) => {
		const color = theme.util.color(props.color!);
		const elevation = props.elevation!;

		const shadow =
			elevation === "none" ? "none" : theme.util.shadow(elevation);

		return {
			root: {
				color: color.text,
				background: color.main,
				boxShadow: shadow,
			},
		};
	}
);

const Surface = dynamic<"div", SurfaceProps>("div", (props) => {
	const {
		as = "div",
		color = "background",
		elevation = "none",
		...baseProps
	} = props;

	const styleProps: SurfaceProps = {
		color,
		elevation,
	};

	const [styles] = useStyles(styleProps, [as, elevation]);

	const overrides = useOverrides("Surface", styleProps, [as, elevation]);

	const classes = useClasses(styles, overrides, props.classes);

	return (
		<Dynamic
			as={as}
			color={color}
			elevation={elevation}
			{...baseProps}
			class={clsx(classes.root, baseProps.class)}
		/>
	);
});

export default Surface;
