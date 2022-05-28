import { clsx } from "@littlethings/css";
import { style } from "../../../theme/style";
import { CSSClass, CSSClasses } from "../../../types/css";
import { Theme } from "../../../types/theme";
import ButtonBase, { ButtonBaseProps } from "../../ButtonBase";
import { dynamic } from "../../Dynamic";

export interface TextButtonClasses extends CSSClasses {
	root: CSSClass;
	disabled: CSSClass;
}

export interface TextButtonProps extends ButtonBaseProps {
	classes?: Partial<ButtonBaseProps["classes"] & TextButtonClasses>;
}

const { useStyles, useOverrides, useClasses } = style(
	(theme: Theme, props: TextButtonProps) => {
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

const TextButton = dynamic<"button", TextButtonProps>("button", (props) => {
	const {
		children,
		as = "button",
		color = "primary",
		size = "md",
		disabled = false,
		...baseProps
	} = props;

	const styles = useStyles(props, [color, disabled]);

	const overrides = useOverrides("TextButton", props, [
		as,
		color,
		size,
		disabled,
	]);

	const classes = useClasses(styles, overrides, props.classes);

	return (
		<ButtonBase
			as={as}
			color={color}
			disabled={disabled}
			size={size}
			{...baseProps}
			LoadingProps={{
				...baseProps.LoadingProps,
				classes: {
					...baseProps.LoadingProps?.classes,
					dot: clsx(styles.dot, baseProps.LoadingProps?.classes?.dot),
				},
			}}
			classes={{
				...baseProps.classes,
				root: clsx(classes.root, baseProps.classes?.root),
				disabled: disabled
					? clsx(classes.disabled, baseProps.classes?.disabled)
					: "",
			}}
		>
			{children}
		</ButtonBase>
	);
});

export default TextButton;
