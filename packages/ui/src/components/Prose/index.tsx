import { clsx } from "@littlethings/css";
import { style } from "../../theme/style";
import { CSSClass, CSSClasses } from "../../types/css";
import {
	Theme,
	ThemeColorName,
	ThemeFontSizeNames,
	ThemeTypographyColors,
	ThemeTypographyName,
} from "../../types/theme";
import { Dynamic, dynamic } from "../Dynamic";

export interface ProseClasses extends CSSClasses {
	root: CSSClass;
}

export interface ProseProps {
	classes?: Partial<ProseClasses>;
	color?: ThemeColorName;
	variant?: keyof ThemeTypographyColors;
	font?: ThemeTypographyName;
	size?: ThemeFontSizeNames;
}

const { useStyles, useOverrides, useClasses } = style(
	(theme: Theme, props: ProseProps) => {
		const color = props.color
			? theme.color(props.color)
			: theme.typography.color.light[props.variant ?? "primary"];

		const font = theme.font(props.font ?? "primary");

		return {
			root: {
				color,
				fontFamily: font.family,
				fontSize: `${font.size}rem`,
				fontWeight: String(font.weight),
				lineHeight: `${font.height}rem`,
			},
		};
	}
);

const Prose = dynamic<"span", ProseProps>("span", (props) => {
	const {
		children,
		as = "span",
		color,
		variant,
		font = "primary",
		size = "md",
		...baseProps
	} = props;

	const styles = useStyles(props, [color, variant, font, size]);

	const overrides = useOverrides("Prose", props);

	const classes = useClasses(styles, overrides, props.classes);

	return (
		<Dynamic as={as} {...baseProps} class={clsx(classes.root, props.class)}>
			{children}
		</Dynamic>
	);
});

export default Prose;
