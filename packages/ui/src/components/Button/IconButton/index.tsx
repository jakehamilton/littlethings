import { clsx } from "@littlethings/css";
import { cloneElement, isValidElement, toChildArray } from "preact";
import useClasses from "../../../hooks/useClasses";
import useOverrides from "../../../hooks/useOverrides";
import { CSSClasses } from "../../../types/css";
import ButtonBase, { ButtonBaseProps } from "../../ButtonBase";
import { dynamic } from "../../Dynamic";
import useIconButtonStyles from "./useIconButtonStyles";

const getIconSize = (size: NonNullable<ButtonBaseProps["size"]>): number => {
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

export interface IconButtonClasses extends CSSClasses {
	root: string;
}

export interface IconButtonProps extends ButtonBaseProps {}

const IconButton = dynamic<"button", IconButtonProps>("button", (props) => {
	const {
		children,
		as = "button",
		color = "primary",
		size = "md",
		disabled = false,
		...baseProps
	} = props;

	const styles = useIconButtonStyles(size, color, disabled);

	const overrides = useOverrides("IconButton", props, [
		as,
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
