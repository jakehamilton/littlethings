import { clsx } from "@littlethings/css";
import ButtonBase, { ButtonBaseProps } from "../../ButtonBase";
import { DynamicComponent } from "../../Dynamic";
import useTextButtonStyles from "./useTextButtonStyles";

export interface TextButtonProps extends ButtonBaseProps {}

const TextButton: DynamicComponent<TextButtonProps, "button"> = ({
	children,
	as = "button",
	color = "primary",
	size = "md",
	disabled = false,
	...props
}) => {
	const classes = useTextButtonStyles({ color, disabled });

	return (
		<ButtonBase
			as={as}
			color={color}
			disabled={disabled}
			size={size}
			{...props}
			class={clsx(
				classes.root,
				disabled ? classes.disabled : null,
				props.class
			)}
		>
			{children}
		</ButtonBase>
	);
};

export default TextButton;
