import { clsx } from "@littlethings/css";
import { FunctionComponent } from "preact";
import useClasses from "../../hooks/useClasses";
import useCSS from "../../hooks/useCSS";
import useOverrides from "../../hooks/useOverrides";
import { CSSClass } from "../../types/css";
import { DynamicComponent } from "../Dynamic";
import useLoadingStyles, { LoadingStylesOptions } from "./useLoadingStyles";

export interface LoadingClasses {
	root: CSSClass;
	container: CSSClass;
	dot: CSSClass;
}

export interface LoadingProps {
	color?: LoadingStylesOptions["color"];
	size?: LoadingStylesOptions["size"];
	classes?: Partial<LoadingClasses>;
}

const Loading: DynamicComponent<LoadingProps, "div"> = (props) => {
	const { color = "primary", size = "md" } = props;

	const styles = useLoadingStyles({ color, size });

	const overrides = useOverrides("Loading", props, [color, size]);

	const classes = useClasses([styles, overrides, props.classes]);

	return (
		<div class={clsx(classes.root, props.class)}>
			<div class={classes.container}>
				<div class={classes.dot} />
				<div class={classes.dot} />
				<div class={classes.dot} />
				<div class={classes.dot} />
			</div>
		</div>
	);
};

export default Loading;
