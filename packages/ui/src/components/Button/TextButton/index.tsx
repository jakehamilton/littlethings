import { clsx } from "@littlethings/css";
import useClasses from "../../../hooks/useClasses";
import useOverrides from "../../../hooks/useOverrides";
import { CSSClass } from "../../../types/css";
import ButtonBase, { ButtonBaseProps } from "../../ButtonBase";
import { DynamicComponent } from "../../Dynamic";
import useTextButtonStyles from "./useTextButtonStyles";

export interface TextButtonClasses {
	root: CSSClass;
	disabled: CSSClass;
}

export interface TextButtonProps extends ButtonBaseProps {
	classes?: Partial<ButtonBaseProps["classes"] & TextButtonClasses>;
}

const TextButton: DynamicComponent<TextButtonProps, "button"> = (props) => {
	const {
		children,
		as = "button",
		color = "primary",
		size = "md",
		disabled = false,
		...baseProps
	} = props;

	const styles = useTextButtonStyles({ color, disabled });

	const overrides = useOverrides("TextButton", props, [
		as,
		color,
		size,
		disabled,
	]);

	const classes = useClasses([styles, overrides, props.classes]);

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
};

export default TextButton;
