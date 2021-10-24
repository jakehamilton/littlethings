import { FunctionComponent } from "preact";
import { ThemeProvider } from "../contexts/Theme";
import useCSS from "../hooks/useCSS";
import useTheme from "../hooks/useTheme";
import { Color } from "../types/color";
import Colors from "./index";

export default {
	title: "Theme/Colors",
	parameters: {
		layout: "fullscreen",
	},
};

const Swatch: FunctionComponent<{ intensity: string; background: string }> = ({
	intensity,
	background,
}) => {
	const classes = useCSS(
		Swatch,
		({ css, theme, util }) => {
			return {
				root: css({
					display: "flex",
					alignItems: "center",
					flexDirection: "column",
				}),
				color: css({
					width: `${util.space(8)}px`,
					height: `${util.space(8)}px`,
					borderRadius: `${util.round("md")}px`,
					background,
				}),
				intensity: css({
					paddingTop: "8px",
					color: theme.typography.color.secondary,
				}),
			};
		},
		[intensity, background]
	);

	return (
		<div class={classes.root}>
			<div class={classes.color}></div>
			<span class={classes.intensity}>{intensity}</span>
		</div>
	);
};

const Swatches: FunctionComponent<{ color: Color; name: string }> = ({
	color,
	name,
}) => {
	const classes = useCSS(Swatches, ({ css, theme }) => {
		return {
			root: css({
				display: "flex",
				flexDirection: "column",
				gap: "4px",
			}),
			title: css({
				color: theme.typography.color.primary,
				fontWeight: "600",
			}),
			swatches: css({
				display: "flex",
				gap: "8px",
				marginBottom: "16px",
			}),
		};
	});

	return (
		<div class={classes.root}>
			<span class={classes.title}>{name}</span>
			<div class={classes.swatches}>
				{Object.keys(color).map((intensity) => (
					<Swatch
						intensity={intensity}
						background={
							color[(intensity as unknown) as keyof Color]
						}
					/>
				))}
			</div>
		</div>
	);
};

const render = () => {
	const classes = useCSS(render, ({ css, theme }) => {
		return {
			root: css({
				padding: `${theme.spacing}px ${theme.spacing * 2}px`,
				backgroundColor: theme.palette.background.main,
			}),
		};
	});

	return (
		<div class={classes.root}>
			{Object.keys(Colors).map((name) => (
				<Swatches
					color={Colors[name as keyof typeof Colors]}
					name={name}
				/>
			))}
		</div>
	);
};

export const Default = render.bind({});
(Default as any).decorators = [
	(Story: FunctionComponent) => (
		<ThemeProvider>
			<Story />
		</ThemeProvider>
	),
];

export const Light = render.bind({});
(Light as any).decorators = [
	(Story: FunctionComponent) => (
		<ThemeProvider mode="light">
			<Story />
		</ThemeProvider>
	),
];

export const Dark = render.bind({});
(Dark as any).decorators = [
	(Story: FunctionComponent) => (
		<ThemeProvider mode="dark">
			<Story />
		</ThemeProvider>
	),
];
