import { clsx } from "@littlethings/css";
import { ComponentChildren, FunctionComponent } from "preact";
import { useRef, useEffect, useCallback, useMemo } from "preact/hooks";
import useRippleEvent from "../../hooks/useRippleEvent";
import useRippleRef from "../../hooks/useRippleRef";
import useTheme from "../../hooks/useTheme";
import { CSSClass } from "../../types/css";
import Dynamic, { DynamicComponent, DynamicProps } from "../Dynamic";
import Loading, { LoadingProps } from "../Loading";
import Ripple, { RippleHandle } from "../Ripple";
import useButtonBaseStyles, {
	ButtonBaseStylesOptions,
} from "./useButtonBaseStyles";

export interface ButtonBaseClasses {
	container?: CSSClass;
	content?: CSSClass;
}

export interface ButtonBaseProps {
	loading?: ButtonBaseStylesOptions["loading"];
	color?: ButtonBaseStylesOptions["color"];
	size?: ButtonBaseStylesOptions["size"];
	disabled?: ButtonBaseStylesOptions["disabled"];
	prefixIcon?: ComponentChildren;
	PrefixIconProps?: DynamicProps<"span">;
	postfixIcon?: ComponentChildren;
	PostfixIconProps?: DynamicProps<"span">;
	LoadingProps?: Partial<LoadingProps>;
	classes?: ButtonBaseClasses;
	onKeyDown?: (event: KeyboardEvent) => void;
	onKeyUp?: (event: KeyboardEvent) => void;
	onMouseUp?: (event: MouseEvent) => void;
	onMouseDown?: (event: MouseEvent) => void;
	onMouseLeave?: (event: MouseEvent) => void;
	onClick?: (event: MouseEvent | KeyboardEvent) => void;
}

const ButtonBase: DynamicComponent<ButtonBaseProps, "button"> = ({
	as = "button",
	children,
	color,
	size = "md",
	loading = false,
	disabled = false,
	prefixIcon,
	PrefixIconProps,
	postfixIcon,
	PostfixIconProps,
	LoadingProps,
	onKeyDown,
	onKeyUp,
	onMouseDown,
	onMouseUp,
	onMouseLeave,
	onClick,
	...props
}) => {
	const rippleRef = useRippleRef();
	const classes = useButtonBaseStyles({
		color,
		size,
		loading,
		disabled,
		hasPrefixIcon: Boolean(prefixIcon),
		hasPostfixIcon: Boolean(postfixIcon),
	});

	const { theme, util } = useTheme();

	const loadingColor = useMemo(() => {
		const background = util.color("background");

		const base = color ? util.color(color) : background;

		return {
			light: base.text,
			dark: base.text,
			main: base.text,
			text: base.text,
		};
	}, [theme, color]);

	const handleRippleMouseDown = useRippleEvent(rippleRef, "add");
	const handleRippleMouseUp = useRippleEvent(rippleRef, "remove");
	const handleRippleMouseLeave = useRippleEvent(rippleRef, "remove");

	const handleMouseDown = useCallback(
		(event: MouseEvent) => {
			onMouseDown?.(event);
			handleRippleMouseDown(event);
		},
		[onMouseDown]
	);

	const handleMouseUp = useCallback(
		(event: MouseEvent) => {
			onMouseUp?.(event);
			handleRippleMouseUp(event);
		},
		[onMouseUp]
	);

	const handleMouseLeave = useCallback(
		(event: MouseEvent) => {
			onMouseLeave?.(event);
			handleRippleMouseLeave(event);
		},
		[onMouseLeave]
	);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			event.preventDefault();

			onKeyDown?.(event);

			if (
				!event.repeat &&
				!disabled &&
				(event.key === "Enter" || event.key === " ")
			) {
				rippleRef.current!.remove(event, () => {
					rippleRef.current!.add(event);
				});
				onClick?.(event);
			}
		},
		[disabled]
	);

	const handleKeyUp = useCallback(
		(event: KeyboardEvent) => {
			event.preventDefault();

			onKeyUp?.(event);

			if (
				!event.repeat &&
				!disabled &&
				(event.key === "Enter" || event.key === " ")
			) {
				rippleRef.current!.remove(event);
			}
		},
		[disabled]
	);

	return (
		<Dynamic
			as={as}
			{...props}
			class={clsx(classes.root, props.class)}
			onMouseDown={disabled ? undefined : handleMouseDown}
			onMouseUp={disabled ? undefined : handleMouseUp}
			onMouseLeave={disabled ? undefined : handleMouseLeave}
			onKeyDown={disabled ? undefined : handleKeyDown}
			onKeyUp={disabled ? undefined : handleKeyUp}
			disabled={disabled}
			aria-disabled={disabled}
		>
			{prefixIcon ? (
				<Dynamic
					as="span"
					class={clsx(classes.prefixIcon, PrefixIconProps?.class)}
				>
					{prefixIcon}
				</Dynamic>
			) : null}
			<span class={clsx(classes.container, props.classes?.container)}>
				{loading ? (
					<Loading
						size={size}
						color={loadingColor}
						class={classes.loading}
						{...LoadingProps}
					/>
				) : null}
				<span
					aria-hidden={loading}
					class={clsx(classes.content, props.classes?.content)}
				>
					{children}
				</span>
			</span>
			{postfixIcon ? (
				<Dynamic
					as="span"
					class={clsx(classes.postfixIcon, PostfixIconProps?.class)}
				>
					{postfixIcon}
				</Dynamic>
			) : null}
			<Ripple handleRef={rippleRef} />
		</Dynamic>
	);
};

export default ButtonBase;
