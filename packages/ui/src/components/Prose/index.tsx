import { clsx } from "@littlethings/css";
import useClasses from "../../hooks/useClasses";
import useOverrides from "../../hooks/useOverrides";
import { CSSClass } from "../../types/css";
import Dynamic, { DynamicComponent } from "../Dynamic";
import useProseStyles, { ProseStylesConfig } from "./useProseStyles";

export interface ProseClasses {
	root: CSSClass;
}

export interface ProseProps {
	classes?: Partial<ProseClasses>;
	color?: ProseStylesConfig["color"];
	variant?: ProseStylesConfig["variant"];
	font?: ProseStylesConfig["font"];
	size?: ProseStylesConfig["size"];
}

const Prose: DynamicComponent<ProseProps, "span"> = (props) => {
	const {
		children,
		as = "span",
		color,
		variant,
		font = "primary",
		size = "md",
		...baseProps
	} = props;

	const styles = useProseStyles(color, variant, font, size);

	const overrides = useOverrides("Prose", props);

	const classes = useClasses([styles, overrides, props.classes]);

	return (
		<Dynamic as={as} {...baseProps} class={clsx(classes.root, props.class)}>
			{children}
		</Dynamic>
	);
};

export default Prose;
