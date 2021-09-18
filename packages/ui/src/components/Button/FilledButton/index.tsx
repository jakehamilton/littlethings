import { clsx } from "@littlethings/css";
import { ComponentChildren } from "preact";
import ButtonBase from "../../ButtonBase";
import Dynamic, { DynamicComponent } from "../../Dynamic";
import useFilledButtonStyles, {
	FilledButtonStylesOptions,
} from "./useFilledButtonStyles";

export interface FilledButtonProps {
	color?: FilledButtonStylesOptions["color"];
	disabled?: FilledButtonStylesOptions["disabled"];
	size?: FilledButtonStylesOptions["size"];
}

const FilledButton: DynamicComponent<FilledButtonProps, "button"> = ({
	children,
	as = "button",
	color = "primary",
	disabled = false,
	size = "md",
	...props
}) => {
	const classes = useFilledButtonStyles({ color, disabled, size });

	return (
		<ButtonBase
			as={as}
			color={color}
			disabled={disabled}
			size={size}
			{...props}
			class={clsx(classes.root, props.class)}
		>
			{children}
		</ButtonBase>
	);
};

export default FilledButton;
