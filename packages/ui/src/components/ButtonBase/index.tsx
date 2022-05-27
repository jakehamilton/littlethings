import { clsx } from "@littlethings/css";
import { ComponentChildren } from "preact";
import { useCallback, useMemo } from "preact/hooks";
import { ThemePaletteColorName } from "../..";
import useRippleEvent from "../../hooks/useRippleEvent";
import useRippleRef from "../../hooks/useRippleRef";
import useTheme from "../../hooks/useTheme";
import { CSSClass, CSSClasses } from "../../types/css";
import { Dynamic, dynamic, DynamicProps } from "../Dynamic";
import Loading, { LoadingProps } from "../Loading";
import Ripple from "../Ripple";
import useButtonBaseStyles, {
	ButtonBaseStylesOptions,
} from "./useButtonBaseStyles";

export interface ButtonBaseClasses extends CSSClasses {
	root: CSSClass;
	container: CSSClass;
	content: CSSClass;
	disabled: CSSClass;
}

export interface ButtonBaseProps {
	ripple?: boolean;
	loading?: ButtonBaseStylesOptions["loading"];
	color?: ButtonBaseStylesOptions["color"] | "text";
	size?: ButtonBaseStylesOptions["size"];
	disabled?: ButtonBaseStylesOptions["disabled"];
	prefixIcon?: ComponentChildren;
	PrefixIconProps?: DynamicProps<"span">;
	postfixIcon?: ComponentChildren;
	PostfixIconProps?: DynamicProps<"span">;
	LoadingProps?: Partial<LoadingProps>;
	classes?: Partial<ButtonBaseClasses>;
	onKeyDown?: (event: KeyboardEvent) => void;
	onKeyUp?: (event: KeyboardEvent) => void;
	onMouseUp?: (event: MouseEvent) => void;
	onMouseDown?: (event: MouseEvent) => void;
	onMouseLeave?: (event: MouseEvent) => void;
	onClick?: (event: MouseEvent | KeyboardEvent) => void;
}

const ButtonBase = dynamic<"button", ButtonBaseProps>(
	"button",
	({
		as = "button",
		children,
		ripple = true,
		color = "text",
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

		const { theme, util } = useTheme();

		const classes = useButtonBaseStyles(
			color,
			size,
			loading,
			disabled,
			Boolean(prefixIcon),
			Boolean(postfixIcon)
		);

		const loadingColor = useMemo(() => {
			if (color === "text") {
				return util.color("background.text");
			} else if (typeof color === "string") {
				const [name] = color.split(".");

				return util.color(`${name as ThemePaletteColorName}.text`);
			} else {
				return util.color(color);
			}
		}, [theme, color]);

		const { add: addRipple, remove: removeRipple } =
			useRippleEvent(rippleRef);

		const handleMouseDown = useCallback(
			(event: MouseEvent) => {
				onMouseDown?.(event);
				addRipple(event);
			},
			[onMouseDown]
		);

		const handleMouseUp = useCallback(
			(event: MouseEvent) => {
				onMouseUp?.(event);
				removeRipple(event);
			},
			[onMouseUp]
		);

		const handleMouseLeave = useCallback(
			(event: MouseEvent) => {
				onMouseLeave?.(event);
				removeRipple(event);
			},
			[onMouseLeave]
		);

		const handleKeyDown = useCallback(
			(event: KeyboardEvent) => {
				onKeyDown?.(event);

				if (
					!event.repeat &&
					!disabled &&
					(event.key === "Enter" || event.key === " ")
				) {
					rippleRef.current?.remove(event, () => {
						rippleRef.current?.add(event);
					});
					onClick?.(event);
				}
			},
			[disabled]
		);

		const handleKeyUp = useCallback(
			(event: KeyboardEvent) => {
				onKeyUp?.(event);

				if (
					!event.repeat &&
					!disabled &&
					(event.key === "Enter" || event.key === " ")
				) {
					rippleRef.current?.remove(event);
				}
			},
			[disabled]
		);

		return (
			<Dynamic
				as={as}
				{...props}
				class={clsx(
					classes.root,
					props.class,
					props.classes?.root,
					disabled ? props.classes?.disabled : null
				)}
				onClick={disabled ? undefined : onClick}
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
						{...PrefixIconProps}
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
						{...PostfixIconProps}
						class={clsx(
							classes.postfixIcon,
							PostfixIconProps?.class
						)}
					>
						{postfixIcon}
					</Dynamic>
				) : null}
				{ripple ? <Ripple handleRef={rippleRef} /> : null}
			</Dynamic>
		);
	}
);

export default ButtonBase;
