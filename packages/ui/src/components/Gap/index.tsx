import { clsx } from "@littlethings/css";
import { style } from "../../theme/style";
import { CSSClass, CSSClasses } from "../../types/css";
import { Theme } from "../../types/theme";
import { Dynamic, dynamic } from "../Dynamic";
import useGapStyles, { GapStylesOptions } from "./useGapStyles";

export interface GapClasses extends CSSClasses {
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

const { useStyles, useOverrides, useClasses } = style(
	(theme: Theme, props: GapProps) => {
		const margin = theme.space(props.size ?? 1);

		return {
			root: {},
			vertical: {
				marginTop: `${margin}px`,
			},
			horizontal: {
				marginTop: `${margin}px`,
			},
		};
	}
);

const Gap = dynamic<"div", GapProps>("div", (props) => {
	const { as = "div", size = 1, vertical, horizontal, ...baseProps } = props;

	const styles = useStyles(props, [size]);

	const overrides = useOverrides("Gap", props, [size, vertical, horizontal]);

	const classes = useClasses(styles, overrides, props.classes);

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
});

export default Gap;
