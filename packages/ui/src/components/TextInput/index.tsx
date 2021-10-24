import { clsx } from "@littlethings/css";
import { CSSClass } from "../../types/css";
import useClasses from "../../hooks/useClasses";
import useOverrides from "../../hooks/useOverrides";
import Dynamic, { DynamicComponent, DynamicProps } from "../Dynamic";
import useTextInputStyles, {
	TextInputStylesOptions,
} from "./useTextInputStyles";
import { cloneElement, ComponentChildren, isValidElement } from "preact";
import useTheme from "../../hooks/useTheme";

export interface TextInputClasses {
	root: CSSClass;
	input: CSSClass;
	disabled: CSSClass;
	prefixIcon: CSSClass;
	postfixIcon: CSSClass;
}

export interface TextInputProps {
	classes?: Partial<TextInputClasses>;
	color?: TextInputStylesOptions["color"];
	focus?: TextInputStylesOptions["focus"];
	border?: TextInputStylesOptions["border"];
	disabled?: boolean;
	RootProps?: DynamicProps<"div">;
	prefixIcon?: ComponentChildren;
	PrefixIconProps?: Omit<DynamicProps<"div">, "as">;
	postfixIcon?: ComponentChildren;
	PostfixIconProps?: Omit<DynamicProps<"div">, "as">;
}

const TextInput: DynamicComponent<TextInputProps, "input"> = (props) => {
	const {
		as = "input",
		color = "background.light",
		focus = "primary",
		border = "background.dark",
		disabled = false,
		prefixIcon,
		PrefixIconProps,
		postfixIcon,
		PostfixIconProps,
		...baseProps
	} = props;

	const { util } = useTheme();

	const styles = useTextInputStyles(
		color,
		focus,
		border,
		Boolean(prefixIcon),
		Boolean(postfixIcon)
	);

	const overrides = useOverrides("TextInput", props);

	const classes = useClasses(styles, overrides, props.classes);

	return (
		<Dynamic
			as="div"
			class={`${disabled ? styles.disabled : ""} ${clsx(
				classes.root,
				disabled ? classes.disabled : null,
				props.class
			)}`}
		>
			{prefixIcon ? (
				<Dynamic
					as="div"
					{...PrefixIconProps}
					class={`${styles.icon} ${clsx(
						classes.prefixIcon,
						PrefixIconProps?.class
					)}`}
				>
					{isValidElement(prefixIcon)
						? cloneElement(prefixIcon, {
								size: util.space(2.5),
								color: "currentColor",
						  })
						: prefixIcon}
				</Dynamic>
			) : null}
			<Dynamic
				as={as}
				{...baseProps}
				class={clsx(classes.input, disabled ? classes.disabled : null)}
				disabled={disabled}
			/>
			{postfixIcon ? (
				<Dynamic
					as="div"
					{...PostfixIconProps}
					class={`${styles.icon} ${clsx(
						classes.postfixIcon,
						PostfixIconProps?.class
					)}`}
				>
					{isValidElement(postfixIcon)
						? cloneElement(postfixIcon, {
								size: util.space(2.5),
								color: "currentColor",
						  })
						: postfixIcon}
				</Dynamic>
			) : null}
		</Dynamic>
	);
};

export default TextInput;
