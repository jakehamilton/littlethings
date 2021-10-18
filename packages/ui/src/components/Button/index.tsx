import { FunctionComponent } from "preact";
import { useMemo } from "preact/hooks";
import FilledButton, { FilledButtonProps } from "./FilledButton";
import OutlinedButton, { OutlinedButtonProps } from "./OutlinedButton";
import TextButton, { TextButtonProps } from "./TextButton";
import IconButton, { IconButtonProps } from "./IconButton";

export type ButtonVariant = "filled" | "outlined" | "text" | "icon";

export type ButtonProps =
	| ({ variant: "filled" } & FilledButtonProps)
	| ({ variant: "outlined" } & OutlinedButtonProps)
	| ({ variant: "text" } & TextButtonProps)
	| ({ variant: "icon" } & IconButtonProps);

const Button: FunctionComponent<ButtonProps> = ({
	variant = "filled",
	...props
}) => {
	const Component = useMemo(() => {
		switch (variant) {
			default:
			case "filled":
				return FilledButton;
			case "outlined":
				return OutlinedButton;
			case "text":
				return TextButton;
			case "icon":
				return IconButton;
		}
	}, [variant]);

	return <Component {...props} />;
};

export default Button;
