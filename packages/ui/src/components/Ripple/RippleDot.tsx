import { clsx } from "@littlethings/css";
import { FunctionComponent } from "preact";
import { useEffect } from "preact/hooks";
import fadeOut from "../../animations/fadeOut";
import grow from "../../animations/grow";
import useCSS from "../../hooks/useCSS";
import useLatest from "../../hooks/useLatest";
import { TransitionGroupChildProps } from "../TransitionGroup/util";

export interface RippleDotProps extends TransitionGroupChildProps {
	x: number;
	y: number;
	size: number;
	duration: number;
	color?: string;
}

const RippleDot: FunctionComponent<RippleDotProps> = (props) => {
	const classes = useCSS(
		"RippleDot",
		({ css }) => {
			const radius = props.size / 2;

			return {
				root: css({
					display: "block",
					position: "absolute",

					width: `${props.size}px`,
					height: `${props.size}px`,
					top: `${-radius + props.y}px`,
					left: `${-radius + props.x}px`,
					opacity: "1",
				}),
				child: css({
					display: "block",
					width: "100%",
					height: "100%",
					borderRadius: "50%",
					backgroundColor: props.color ?? "currentColor",
					opacity: "0.3",
					transform: "scale(1)",
				}),
				enter: css({
					animation: `${grow} ${props.duration}ms ease-in-out`,
					opacity: "0.3",
					transform: "scale(1)",
				}),
				exit: css({
					animation: `${fadeOut} ${props.duration}ms ease-in-out`,
					opacity: "0",
				}),
			};
		},
		[props.x, props.y, props.size, props.duration]
	);

	useEffect(() => {
		return () => {
			if (props.in === true) {
				setTimeout(props.onExited, props.duration);
			}
		};
	}, [props.in]);

	return (
		<span class={clsx(classes.root, !props.in && classes.exit)}>
			<span class={clsx(classes.child, classes.enter)} />
		</span>
	);
};

export default RippleDot;
