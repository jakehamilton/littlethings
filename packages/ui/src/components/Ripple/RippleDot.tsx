import { clsx } from "@littlethings/css";
import { FunctionComponent } from "preact";
import useCSS from "../../hooks/useCSS";

export interface RippleDotProps {
	x: number;
	y: number;
	size: number;
	duration: number;
	exit: boolean;
	color?: string;
}

const RippleDot: FunctionComponent<RippleDotProps> = ({
	x,
	y,
	size,
	duration,
	exit,
	color,
}) => {
	const classes = useCSS(
		({ css, keyframes }) => {
			const grow = keyframes`
				from {
					transform: scale(0);
					opacity: 0.1;
				}
				to {
					transform: scale(1);
					opacity: 0.3;
				}
			`;

			const fadeOut = keyframes`
				from {
					opacity: 1;
				}
				to {
					opacity: 0;
				}
			`;

			const radius = size / 2;

			return {
				root: css`
					display: block;
					position: absolute;

					width: ${size}px;
					height: ${size}px;
					top: ${-radius + y}px;
					left: ${-radius + x}px;
					opacity: 1;
				`,
				child: css`
					display: block;
					width: 100%;
					height: 100%;
					border-radius: 50%;
					background-color: ${color ?? "currentColor"};
					opacity: 0.3;
					transform: scale(1);
				`,
				enter: css`
					animation: ${grow} ${duration}ms ease-in-out;
					opacity: 0.3;
					transform: scale(1);
				`,
				exit: css`
					animation: ${fadeOut} ${duration}ms ease-in-out;
					opacity: 0;
				`,
			};
		},
		[x, y, size]
	);

	return (
		<span class={clsx(classes.root, exit && classes.exit)}>
			<span class={clsx(classes.child, classes.enter)} />
		</span>
	);
};

export default RippleDot;
