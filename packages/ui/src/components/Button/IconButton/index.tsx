import { clsx } from "@littlethings/css";
import { cloneElement, isValidElement, toChildArray } from "preact";
import { style } from "../../../theme/style";
import { CSSClasses } from "../../../types/css";
import { Theme } from "../../../types/theme";
import ButtonBase, { ButtonBaseProps } from "../../ButtonBase";
import { dynamic } from "../../Dynamic";

type Size = NonNullable<ButtonBaseProps["size"]>;

const getIconSize = (size: Size): number => {
	switch (size) {
		case "sm":
			return 16;
		default:
		case "md":
			return 18;
		case "lg":
			return 22;
		case "xl":
			return 28;
	}
};

const getSize = (size: Size): number => {
	switch (size) {
		case "sm":
			return 36;
		default:
		case "md":
			return 42;
		case "lg":
			return 52;
		case "xl":
			return 64;
	}
};

export interface IconButtonClasses extends CSSClasses {
	root: string;
}

export interface IconButtonProps extends ButtonBaseProps {}

const { useStyles, useOverrides, useClasses } = style(
	(theme: Theme, props: IconButtonProps) => {
		const size = getSize(props.size ?? "md");
		const color =
			props.color === undefined ||
			props.color === "text" ||
			props.color === "background"
				? theme.typography.color.light.primary
				: theme.color(props.color);

		const disabledColor = theme.color("disabled.text");

		return {
			root: {
				color,
				borderRadius: "50%",
				width: `${size}px`,
				height: `${size}px`,
				padding: "0",

				"&::before": {
					borderRadius: "50%",
				},
			},
			content: {
				display: "inline-flex",
				alignItems: "center",
				justifyContent: "center",
				width: `${size}px`,
				height: `${size}px`,
				overflow: "hidden",
			},
			disabled: {
				color: disabledColor,
			},
			dot: {
				background: props.disabled ? disabledColor : color,
			},
		};
	}
);

const IconButton = dynamic<"button", IconButtonProps>("button", (props) => {
	const {
		children,
		as = "button",
		color = "primary",
		size = "md",
		disabled = false,
		...baseProps
	} = props;

	const styles = useStyles(props, [size, color, disabled]);

	const overrides = useOverrides("IconButton", props, [
		color,
		size,
		disabled,
	]);

	const classes = useClasses(styles, overrides, props.classes);

	const child = toChildArray(children)[0];

	return (
		<ButtonBase
			as={as}
			color={color}
			disabled={disabled}
			size={size}
			{...baseProps}
			classes={classes}
			LoadingProps={{
				...baseProps.LoadingProps,
				classes: {
					...baseProps.LoadingProps?.classes,
					dot: clsx(styles.dot, baseProps.LoadingProps?.classes?.dot),
				},
			}}
		>
			{isValidElement(child)
				? cloneElement(child, {
						size: getIconSize(size),
						color: "currentColor",
				  })
				: child}
		</ButtonBase>
	);
});

export default IconButton;
