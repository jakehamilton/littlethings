import { clsx } from "@littlethings/css";
import { ComponentChildren, FunctionComponent } from "preact";
import { useRef, useEffect, useCallback } from "preact/hooks";
import useRippleEvent from "../../hooks/useRippleEvent";
import useRippleRef from "../../hooks/useRippleRef";
import Dynamic, { DynamicComponent } from "../Dynamic";
import Ripple, { RippleHandle } from "../Ripple";
import useButtonBaseStyles, {
	ButtonBaseStylesOptions,
} from "./useButtonBaseStyles";

export interface ButtonBaseProps {
	loading?: ButtonBaseStylesOptions["loading"];
	color?: ButtonBaseStylesOptions["color"];
	size?: ButtonBaseStylesOptions["size"];
	disabled?: ButtonBaseStylesOptions["disabled"];
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
	onKeyDown,
	onKeyUp,
	onMouseDown,
	onMouseUp,
	onMouseLeave,
	onClick,
	...props
}) => {
	const rippleRef = useRippleRef();
	const classes = useButtonBaseStyles({ color, size, loading, disabled });

	const handleRippleMouseDown = useRippleEvent(rippleRef, "add");
	const handleRippleMouseUp = useRippleEvent(rippleRef, "remove");
	const handleRippleMouseLeave = useRippleEvent(rippleRef, "remove");

	const handleMouseDown = useCallback(
		(event: MouseEvent) => {
			handleRippleMouseDown(event);
			onMouseDown?.(event);
		},
		[onMouseDown]
	);

	const handleMouseUp = useCallback(
		(event: MouseEvent) => {
			handleRippleMouseUp(event);
			onMouseUp?.(event);
		},
		[onMouseUp]
	);

	const handleMouseLeave = useCallback(
		(event: MouseEvent) => {
			handleRippleMouseLeave(event);
			onMouseLeave?.(event);
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
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
			onMouseLeave={handleMouseLeave}
			onKeyDown={handleKeyDown}
			onKeyUp={handleKeyUp}
		>
			{/* @TODO(jakehamilton): Add a loading spinner */}
			{loading ? null : children}
			<Ripple handleRef={rippleRef} />
		</Dynamic>
	);
};

export default ButtonBase;
