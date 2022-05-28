import { clsx } from "@littlethings/css";
import { style } from "../../../theme/style";
import { CSSClass, CSSClasses } from "../../../types/css";
import { Theme } from "../../../types/theme";
import ButtonBase, { ButtonBaseProps } from "../../ButtonBase";
import { dynamic } from "../../Dynamic";

export interface FilledButtonClasses extends CSSClasses {
	root: CSSClass;
	float: CSSClass;
	disabled: CSSClass;
}

export interface FilledButtonProps extends ButtonBaseProps {
	classes?: Partial<ButtonBaseProps["classes"] & FilledButtonClasses>;
	float?: boolean;
}

const { useStyles, useOverrides, useClasses } = style(
	(theme: Theme, props: FilledButtonProps) => {
		const color =
			props.color === undefined || props.color === "text"
				? theme.color("background.text")
				: theme.color(props.color, { variant: "text" });

		const background =
			props.color === undefined || props.color === "text"
				? theme.color("background.main")
				: theme.color(props.color, { variant: "main" });

		const disabledColor = theme.color("disabled.text");
		const disabledBackground = theme.color("disabled.main");

		return {
			root: {
				color,
				background,
				boxShadow: theme.shadow("sm"),
				transition: "background 150ms linear, box-shadow 150ms linear",

				"&:hover": {
					// background: util.lighten(themeColor.main, 8),
				},

				"&:active": {
					// background: util.darken(themeColor.main, 2),
					transition:
						"background 115ms linear, box-shadow 115ms linear",
				},
			},
			float: {
				transform: "scale(1) translateY(0)",
				boxShadow: theme.shadow("md"),
				transition:
					"transform 150ms linear, background 150ms linear, box-shadow 150ms linear",

				"&:hover": {
					transform: `scale(1) translateY(${theme.space(-0.5)}px)`,
					// background: util.lighten(themeColor.main, 8),
					boxShadow: props.disabled
						? theme.shadow("md")
						: theme.shadow("lg"),
				},

				"&:active": {
					transition:
						"transform 115ms linear, background 115ms linear, box-shadow 115ms linear",
					transform: `scale(1) translateY(${theme.space(0.25)}px)`,
					// background: util.darken(themeColor.main, 2),
					boxShadow: props.disabled
						? theme.shadow("md")
						: theme.shadow("xs"),
				},
			},
			dot: {
				background: props.disabled ? disabledColor : color,
			},
			disabled: {
				color: disabledColor,
				background: disabledBackground,
				transform: "none",

				"&:hover": {
					color: disabledColor,
					background: disabledBackground,
					transform: "none",
				},

				"&:active": {
					color: disabledColor,
					background: disabledBackground,
					transform: "none",
				},
			},
		};
	}
);

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

	const styles = useStyles(props, [color, disabled]);

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
