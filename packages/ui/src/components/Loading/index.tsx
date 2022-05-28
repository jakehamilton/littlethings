import { clsx } from "@littlethings/css";
import spinCenter from "../../animations/spinCenter";
import { style } from "../../theme/style";
import { CSSClass, CSSClasses } from "../../types/css";
import { Theme, ThemeColorName } from "../../types/theme";
import { dynamic } from "../Dynamic";

export interface LoadingClasses extends CSSClasses {
	root: CSSClass;
	container: CSSClass;
	dot: CSSClass;
}

type Size = "sm" | "md" | "lg" | "xl";

interface Measurements {
	rootSize: number;
	dotSize: number;
}

export interface LoadingProps {
	color?: ThemeColorName;
	size?: Size;
	classes?: Partial<LoadingClasses>;
}

const getMeasurements = (size: Size): Measurements => {
	switch (size) {
		case "sm":
			return {
				rootSize: 19,
				dotSize: 8,
			};
		case "md":
			return {
				rootSize: 22,
				dotSize: 9,
			};
		case "lg":
			return {
				rootSize: 24,
				dotSize: 10,
			};
		case "xl":
			return {
				rootSize: 30,
				dotSize: 13,
			};
	}
};

const { useStyles, useOverrides, useClasses } = style(
	(theme: Theme, props: LoadingProps) => {
		const background = theme.color(props.color ?? "primary.main");

		const { rootSize, dotSize } = getMeasurements(props.size ?? "md");

		return {
			root: {
				position: "relative",
				width: `${rootSize}px`,
				height: `${rootSize}px`,
			},
			container: {
				position: "absolute",

				width: `${rootSize}px`,
				height: `${rootSize}px`,

				top: "50%",
				left: "50%",

				transform: "translate(-50%, -50%) rotate(0)",
				animation: `${spinCenter} 1.3s cubic-bezier(0.53, 0.16, 0.39, 0.9) infinite`,
			},
			dot: {
				position: "absolute",

				width: `${dotSize}px`,
				height: `${dotSize}px`,

				borderRadius: "50%",

				background,

				"&:nth-child(1)": {
					top: "0",
					left: "0",
				},

				"&:nth-child(2)": {
					top: "0",
					right: "0",
				},

				"&:nth-child(3)": {
					bottom: "0",
					left: "0",
				},

				"&:nth-child(4)": {
					bottom: "0",
					right: "0",
				},
			},
		};
	}
);

const Loading = dynamic<"div", LoadingProps>("div", (props) => {
	const styles = useStyles(props, [props.color, props.size]);

	const overrides = useOverrides("Loading", props, [props.color, props.size]);

	const classes = useClasses(styles, overrides, props.classes);

	return (
		<div class={clsx(classes.root, props.class)}>
			<div class={classes.container}>
				<div class={classes.dot} />
				<div class={classes.dot} />
				<div class={classes.dot} />
				<div class={classes.dot} />
			</div>
		</div>
	);
});

export default Loading;
