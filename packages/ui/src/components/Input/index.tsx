import { clsx } from "@littlethings/css";
import { CSSClass, CSSClasses } from "../../types/css";
import { cloneElement, ComponentChildren, isValidElement } from "preact";
import useTheme from "../../hooks/useTheme";
import { Dynamic, dynamic, DynamicProps } from "../Dynamic";
import { Theme, ThemeColorName } from "../../types/theme";
import { style } from "../../theme/style";

export interface InputClasses extends CSSClasses {
	root: CSSClass;
	input: CSSClass;
	disabled: CSSClass;
	prefixIcon: CSSClass;
	postfixIcon: CSSClass;
}

export interface InputProps {
	classes?: Partial<InputClasses>;
	color?: ThemeColorName;
	focus?: ThemeColorName;
	border?: ThemeColorName;
	disabled?: boolean;
	RootProps?: Omit<DynamicProps<"div">, "as">;
	prefixIcon?: ComponentChildren;
	PrefixIconProps?: Omit<DynamicProps<"div">, "as">;
	postfixIcon?: ComponentChildren;
	PostfixIconProps?: Omit<DynamicProps<"div">, "as">;
}

const { useStyles, useOverrides, useClasses } = style(
	(theme: Theme, props: InputProps) => {
		return {
			root: {},
			input: {},
			icon: {},
			disabled: {},
			prefixIcon: {},
			postfixIcon: {},
		};
	}
);

const TextInput = dynamic<"input", InputProps>("input", (props) => {
	const {
		as = "input",
		color = "background.light",
		focus = "primary",
		border = "background.dark",
		disabled = false,
		RootProps,
		prefixIcon,
		PrefixIconProps,
		postfixIcon,
		PostfixIconProps,
		innerRef,
		...baseProps
	} = props;

	const { theme } = useTheme();

	const styles = useStyles(props, [
		color,
		focus,
		border,
		Boolean(prefixIcon),
		Boolean(postfixIcon),
	]);

	const overrides = useOverrides("TextInput", props, [
		color,
		focus,
		border,
		Boolean(prefixIcon),
		Boolean(postfixIcon),
	]);

	const classes = useClasses(styles, overrides, props.classes);

	return (
		<Dynamic
			as="div"
			{...RootProps}
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
								size: theme.space(2.5),
								color: "currentColor",
						  })
						: prefixIcon}
				</Dynamic>
			) : null}
			<Dynamic
				as={as}
				innerRef={innerRef}
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
								size: theme.space(2.5),
								color: "currentColor",
						  })
						: postfixIcon}
				</Dynamic>
			) : null}
		</Dynamic>
	);
});

export default TextInput;
