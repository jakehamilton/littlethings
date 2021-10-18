import { clsx } from "@littlethings/css";
import useClasses from "../../hooks/useClasses";
import useOverrides from "../../hooks/useOverrides";
import { CSSClass } from "../../types/css";
import Dynamic, { DynamicComponent } from "../Dynamic";
import useGapStyles, { GapStylesOptions } from "./useGapStyles";

export interface GapClasses {
	root: CSSClass;
	horizontal: CSSClass;
	vertical: CSSClass;
}

export interface GapProps {
	classes?: GapClasses;
	size?: GapStylesOptions["size"];
	vertical?: GapStylesOptions["vertical"];
	horizontal?: GapStylesOptions["horizontal"];
}

const Gap: DynamicComponent<GapProps, "div"> = (props) => {
	const { as = "div", size = 1, vertical, horizontal, ...baseProps } = props;

	const styles = useGapStyles({ size, vertical, horizontal });

	const overrides = useOverrides("Gap", props, [size, vertical, horizontal]);

	const classes = useClasses([styles, overrides, props.classes]);

	return (
		<Dynamic
			{...baseProps}
			as={as}
			class={clsx(
				classes.root,
				horizontal ? classes.horizontal : classes.vertical,
				props.class
			)}
		/>
	);
};

export default Gap;
