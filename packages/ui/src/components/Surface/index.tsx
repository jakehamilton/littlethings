import { clsx } from "@littlethings/css";
import Dynamic, { DynamicComponent } from "../Dynamic";
import useSurfaceStyles, { SurfaceStylesOptions } from "./useSurfaceStyles";

export interface SurfaceProps {
	elevation?: SurfaceStylesOptions["elevation"];
}

const Surface: DynamicComponent<SurfaceProps, "div"> = ({
	as = "div",
	elevation = "none",
	...props
}) => {
	const classes = useSurfaceStyles({ elevation });

	return (
		<Dynamic as={as} {...props} class={clsx(classes.root, props.class)} />
	);
};

export default Surface;
