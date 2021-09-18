import { clsx } from "@littlethings/css";
import { ComponentChildren, FunctionComponent } from "preact";
import { useRef, useEffect } from "preact/hooks";
import useRippleEvent from "../../hooks/useRippleEvent";
import Dynamic, { DynamicComponent } from "../Dynamic";
import Ripple, { RippleHandle } from "../Ripple/index.old";
import useButtonBaseStyles, {
	ButtonBaseStylesOptions,
} from "./useButtonBaseStyles";

export interface ButtonBaseProps {
	loading?: ButtonBaseStylesOptions["loading"];
	color?: ButtonBaseStylesOptions["color"];
	size?: ButtonBaseStylesOptions["size"];
}

const ButtonBase: DynamicComponent<ButtonBaseProps, "button"> = ({
	as = "button",
	children,
	color,
	size = "md",
	loading = false,
	...props
}) => {
	const rippleRef = useRef<RippleHandle>(null);
	const classes = useButtonBaseStyles({ color, size, loading });

	const isHandlingKeydown = useRef(false);

	const handleMouseDown = useRippleEvent(rippleRef, "start", {}, () => {});
	const handleMouseUp = useRippleEvent(rippleRef, "stop", {}, () => {});
	const handleMouseLeave = useRippleEvent(rippleRef, "stop", {}, () => {});
	const handleKeyDown = useRippleEvent(rippleRef, "start", {}, () => {});
	const handleKeyUp = useRippleEvent(rippleRef, "stop", {}, () => {});

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
			<Ripple handle={rippleRef} />
		</Dynamic>
	);
};

export default ButtonBase;
