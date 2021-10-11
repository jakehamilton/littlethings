import { clsx } from "@littlethings/css";
import { FunctionComponent } from "preact";
import ButtonBase, { ButtonBaseProps } from "../../ButtonBase";
import { DynamicComponent } from "../../Dynamic";
import useOutlinedButtonStyles from "./useOutlinedButtonStyles";

export interface OutlinedButtonProps extends ButtonBaseProps {}

const OutlinedButton: DynamicComponent<OutlinedButtonProps, "button"> = ({
	children,
	as = "button",
	color = "primary",
	size = "md",
	disabled = false,
	...props
}) => {
	const classes = useOutlinedButtonStyles({ color, disabled });

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

export default OutlinedButton;
