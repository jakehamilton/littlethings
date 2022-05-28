import { clsx } from "@littlethings/css";
import { style } from "../../theme/style";
import { CSSClass, CSSClasses } from "../../types/css";
import { Theme, ThemeColorName, ThemeShadows } from "../../types/theme";
import { Dynamic, dynamic } from "../Dynamic";

export interface SurfaceClasses extends CSSClasses {
	root: CSSClass;
}

export interface SurfaceProps {
	classes?: Partial<SurfaceClasses>;
	color?: ThemeColorName;
	elevation?: keyof ThemeShadows | "none";
}

const { useStyles, useOverrides, useClasses } = style(
	(theme: Theme, props: SurfaceProps) => {
		return {
			root: {
				color: theme.color(props.color!, { variant: "text" }),
				background: theme.color(props.color!, { variant: "main" }),
				boxShadow:
					props.elevation === undefined || props.elevation === "none"
						? "none"
						: theme.shadow(props.elevation),
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

	const styles = useStyles(styleProps, [as, elevation]);

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
