import { clsx } from "@littlethings/css";
import useClasses from "../../../hooks/useClasses";
import useOverrides from "../../../hooks/useOverrides";
import { CSSClass } from "../../../types/css";
import ButtonBase, { ButtonBaseProps } from "../../ButtonBase";
import { dynamic } from "../../Dynamic";
import useFilledButtonStyles from "./useFilledButtonStyles";

export interface FilledButtonClasses {
	root: CSSClass;
	float: CSSClass;
	disabled: CSSClass;
}

export interface FilledButtonProps extends ButtonBaseProps {
	classes?: Partial<ButtonBaseProps["classes"] & FilledButtonClasses>;
	float?: boolean;
}

const FilledButton = dynamic<"button", FilledButtonProps>("button", (props) => {
	const {
		children,
		as = "button",
		color = "primary",
		disabled = false,
		size = "md",
		float = false,
		...baseProps
	} = props;

	const styles = useFilledButtonStyles(color, disabled);

	const overrides = useOverrides("FilledButton", props, [
		as,
		color,
		disabled,
		size,
		float,
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
					dot: clsx(
						disabled ? styles.dot : null,
						baseProps.LoadingProps?.classes?.dot
					),
				},
			}}
			classes={{
				...baseProps.classes,
				root: clsx(
					classes.root,
					baseProps.classes?.root,
					float ? classes.float : null
				),
				disabled: disabled
					? clsx(classes.disabled, baseProps.classes?.disabled)
					: "",
			}}
		>
			{children}
		</ButtonBase>
	);
});

export default FilledButton;
