import { clsx } from "@littlethings/css";
import { style } from "../../../theme/style";
import { CSSClass } from "../../../types/css";
import { Theme } from "../../../types/theme";
import ButtonBase, {
	ButtonBaseClasses,
	ButtonBaseProps,
} from "../../ButtonBase";
import { dynamic } from "../../Dynamic";

export interface OutlinedButtonClasses extends ButtonBaseClasses {
	root: CSSClass;
	disabled: CSSClass;
}

export interface OutlinedButtonProps extends ButtonBaseProps {
	classes?: Partial<OutlinedButtonClasses>;
}

const { useStyles, useOverrides, useClasses } = style(
	(theme: Theme, props: OutlinedButtonProps) => {
		const color =
			props.color === undefined ||
			props.color === "text" ||
			props.color === "background"
				? theme.typography.color.light.primary
				: theme.color(props.color);

		const disabledColor = theme.color("disabled.text");

		return {
			root: {
				color,
				border: `2px solid ${color}`,
			},
			disabled: {
				color: disabledColor,
				border: `2px solid ${disabledColor}`,
			},
			dot: {
				background: props.disabled ? disabledColor : color,
			},
		};
	}
);

const OutlinedButton = dynamic<"button", OutlinedButtonProps>(
	"button",
	(props) => {
		const {
			children,
			as = "button",
			color = "primary",
			size = "md",
			disabled = false,
			...baseProps
		} = props;

		const styles = useStyles(props, [color, disabled]);

		const overrides = useOverrides("OutlinedButton", props, [
			color,
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
	}
);

export default OutlinedButton;
