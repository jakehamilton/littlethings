import { clsx } from "@littlethings/css";
import useClasses from "../../../hooks/useClasses";
import useOverrides from "../../../hooks/useOverrides";
import { CSSClass } from "../../../types/css";
import ButtonBase, {
	ButtonBaseClasses,
	ButtonBaseProps,
} from "../../ButtonBase";
import { DynamicComponent } from "../../Dynamic";
import useOutlinedButtonStyles from "./useOutlinedButtonStyles";

export interface OutlinedButtonClasses extends ButtonBaseClasses {
	root: CSSClass;
	disabled: CSSClass;
}

export interface OutlinedButtonProps extends ButtonBaseProps {
	classes?: Partial<OutlinedButtonClasses>;
}

const OutlinedButton: DynamicComponent<OutlinedButtonProps, "button"> = (
	props
) => {
	const {
		children,
		as = "button",
		color = "primary",
		size = "md",
		disabled = false,
		...baseProps
	} = props;

	const styles = useOutlinedButtonStyles(color, disabled);

	const overrides = useOverrides("OutlinedButton", props, [
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
				...props.LoadingProps,
				classes: {
					...props.LoadingProps?.classes,
					dot: clsx(styles.dot, props.LoadingProps?.classes?.dot),
				},
			}}
			classes={{
				...props.classes,
				root: clsx(classes.root, props.classes?.root),
				disabled: clsx(classes.disabled, props.classes?.disabled),
			}}
		>
			{children}
		</ButtonBase>
	);
};

export default OutlinedButton;
