import { clsx } from "@littlethings/css";
import useClasses from "../../hooks/useClasses";
import useOverrides from "../../hooks/useOverrides";
import { CSSClass } from "../../types/css";
import Dynamic, { DynamicComponent } from "../Dynamic";
import useSurfaceStyles, { SurfaceStylesOptions } from "./useSurfaceStyles";

export interface SurfaceClasses {
	root: CSSClass;
}

export interface SurfaceProps {
	classes?: Partial<SurfaceClasses>;
	color?: SurfaceStylesOptions["color"];
	variant?: SurfaceStylesOptions["variant"];
	elevation?: SurfaceStylesOptions["elevation"];
}

const Surface: DynamicComponent<SurfaceProps, "div"> = (props) => {
	const {
		as = "div",
		color = "background",
		variant = "main",
		elevation = "none",
		...baseProps
	} = props;

	const styles = useSurfaceStyles(color, variant, elevation);

	const overrides = useOverrides("Surface", props, [as, elevation]);

	const classes = useClasses([styles, overrides, props.classes]);

	return (
		<Dynamic
			as={as}
			color={color}
			variant={variant}
			elevation={elevation}
			{...baseProps}
			class={clsx(classes.root, baseProps.class)}
		/>
	);
};

export default Surface;
