import { clsx } from "@littlethings/css";
import { ComponentChildren } from "preact";
import ButtonBase, { ButtonBaseProps } from "../../ButtonBase";
import Dynamic, { DynamicComponent } from "../../Dynamic";
import useFilledButtonStyles, {
	FilledButtonStylesOptions,
} from "./useFilledButtonStyles";

export interface FilledButtonProps extends ButtonBaseProps {
	float?: boolean;
}

const FilledButton: DynamicComponent<FilledButtonProps, "button"> = ({
	children,
	as = "button",
	color = "primary",
	disabled = false,
	size = "md",
	float = false,
	...props
}) => {
	const classes = useFilledButtonStyles({ color, disabled });

	return (
		<ButtonBase
			as={as}
			color={color}
			disabled={disabled}
			size={size}
			{...props}
			class={clsx(
				classes.root,
				float ? classes.float : null,
				props.class
			)}
		>
			{children}
		</ButtonBase>
	);
};

export default FilledButton;
