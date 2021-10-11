import { clsx } from "@littlethings/css";
import { FunctionComponent } from "preact";
import useCSS from "../../hooks/useCSS";
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

const Loading: DynamicComponent<LoadingProps, "div"> = ({
	color = "primary",
	size = "md",
	...props
}) => {
	const classes = useLoadingStyles({ color, size });

	return (
		<div class={clsx(classes.root, props.class, props.classes?.root)}>
			<div class={clsx(classes.container, props.classes?.container)}>
				<div class={clsx(classes.dot, props.classes?.dot)} />
				<div class={clsx(classes.dot, props.classes?.dot)} />
				<div class={clsx(classes.dot, props.classes?.dot)} />
				<div class={clsx(classes.dot, props.classes?.dot)} />
			</div>
		</div>
	);
};

export default Loading;
