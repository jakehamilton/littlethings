import { clsx } from "@littlethings/css";
import { ComponentChildren } from "preact";
import { useCallback, useMemo } from "preact/hooks";
import { ThemePaletteColorName } from "../..";
import useRippleEvent from "../../hooks/useRippleEvent";
import useRippleRef from "../../hooks/useRippleRef";
import useTheme from "../../hooks/useTheme";
import { style } from "../../theme/style";
import { CSSClass, CSSClasses } from "../../types/css";
import { Theme, ThemeColorName, ThemeFont } from "../../types/theme";
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
	color?: ThemeColorName | "text";
	size?: Size;
	disabled?: boolean;
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

export type Size = "sm" | "md" | "lg" | "xl";

interface Padding {
	left: number;
	right: number;
	top: number;
	bottom: number;
}

const getPadding = (
	size: Size,
	hasPrefixIcon: ButtonBaseStylesOptions["hasPrefixIcon"],
	hasPostfixIcon: ButtonBaseStylesOptions["hasPostfixIcon"]
): Padding => {
	switch (size) {
		case "sm":
			return {
				left: hasPrefixIcon ? 1.5 : 1.75,
				right: hasPostfixIcon ? 1.5 : 1.75,
				top: 0.75,
				bottom: 0.75,
			};
		case "md":
			return {
				left: hasPrefixIcon ? 1.75 : 2,
				right: hasPostfixIcon ? 1.75 : 2,
				top: 1,
				bottom: 1,
			};
		case "lg":
			return {
				left: hasPrefixIcon ? 2 : 2.25,
				right: hasPostfixIcon ? 2 : 2.25,
				top: 1,
				bottom: 1,
			};
		case "xl":
			return {
				left: hasPrefixIcon ? 2.5 : 2.75,
				right: hasPostfixIcon ? 2.5 : 2.75,
				top: 1.5,
				bottom: 1.5,
			};
	}
};

const getFontSize = (size: Size): keyof ThemeFont["sizes"] => {
	switch (size) {
		case "sm":
			return "sm";
		case "md":
			return "sm";
		case "lg":
			return "md";
		case "xl":
			return "lg";
	}
};

const getFontWeight = (size: Size): string => {
	switch (size) {
		case "sm":
			return "600";
		case "md":
			return "600";
		case "lg":
			return "600";
		case "xl":
			return "600";
	}
};

const { useStyles } = style((theme: Theme, props: ButtonBaseProps) => {
	const focusRingColor =
		props.color === undefined ||
		props.color === "text" ||
		props.color === "background"
			? theme.typography.color.light.primary
			: theme.color(props.color);

	const padding = getPadding(
		props.size ?? "md",
		Boolean(props.prefixIcon),
		Boolean(props.postfixIcon)
	);

	const font = theme.font(`primary.${props.size ?? "md"}`);

	return {
		root: {
			display: "inline-flex",
			alignItems: "center",
			position: "relative",

			border: "none",
			outline: "none",
			background: "transparent",

			cursor: props.disabled ? "initial" : "pointer",
			borderRadius: `${theme.round("sm")}px`,

			fontSize: `${font.size}rem`,
			fontWeight: getFontWeight(props.size ?? "md"),
			lineHeight: `${font.height}rem`,
			textTransform: "uppercase",

			paddingLeft: `${theme.space(padding.left)}px`,
			paddingRight: `${theme.space(padding.right)}px`,
			paddingTop: `${theme.space(padding.top)}px`,
			paddingBottom: `${theme.space(padding.bottom)}px`,

			"&:focus": {
				outline: "none",
			},

			"&::before": {
				position: "absolute",
				display: "block",
				content: "''",

				width: `calc(100% + ${theme.space(2)}px)`,
				height: `calc(100% + ${theme.space(2)}px)`,

				top: "50%",
				left: "50%",

				transform: "translate(-50%, -50%)",

				border: `4px solid ${focusRingColor}`,
				borderRadius: `${theme.round("md")}px`,

				opacity: "0",
				visibility: "hidden",
				pointerEvents: "none",
			},

			"&:focus-visible": {
				"&::before": {
					opacity: "1",
					visibility: "visible",
				},
			},
		},
		container: {
			position: "relative",
		},
		loading: {
			position: "absolute",
			width: "100%",
			height: "100%",
			top: "50%",
			left: "50%",
			transform: "translate(-50%, -50%)",
		},
		content: {
			opacity: props.loading ? "0" : "1",
			visibility: props.loading ? "hidden" : "visible",
		},
		prefixIcon: {
			display: "inline-flex",
			marginRight: `${theme.space(0.5)}px`,
		},
		postfixIcon: {
			display: "inline-flex",
			marginLeft: `${theme.space(0.5)}px`,
		},
	};
});

const ButtonBase = dynamic<"button", ButtonBaseProps>("button", (baseProps) => {
	const {
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
	} = baseProps;

	const rippleRef = useRippleRef();

	const styles = useStyles(baseProps, [
		color,
		size,
		loading,
		disabled,
		Boolean(prefixIcon),
		Boolean(postfixIcon),
	]);

	const loadingColor = color === "text" ? "background.text" : color;

	const { add: addRipple, remove: removeRipple } = useRippleEvent(rippleRef);

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
				styles.root,
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
					class={clsx(styles.prefixIcon, PrefixIconProps?.class)}
				>
					{prefixIcon}
				</Dynamic>
			) : null}
			<span class={clsx(styles.container, props.classes?.container)}>
				{loading ? (
					<Loading
						size={size}
						color={loadingColor}
						class={styles.loading}
						{...LoadingProps}
					/>
				) : null}
				<span
					aria-hidden={loading}
					class={clsx(styles.content, props.classes?.content)}
				>
					{children}
				</span>
			</span>
			{postfixIcon ? (
				<Dynamic
					as="span"
					{...PostfixIconProps}
					class={clsx(styles.postfixIcon, PostfixIconProps?.class)}
				>
					{postfixIcon}
				</Dynamic>
			) : null}
			{ripple ? <Ripple handleRef={rippleRef} /> : null}
		</Dynamic>
	);
});

export default ButtonBase;
