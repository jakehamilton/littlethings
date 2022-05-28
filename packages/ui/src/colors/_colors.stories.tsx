import { FunctionComponent } from "preact";
import { ThemeProvider } from "../contexts/Theme";
import useTheme from "../hooks/useTheme";
import { style } from "../theme/style";
import { Color } from "../types/color";
import { Theme } from "../types/theme";
import Colors from "./index";

export default {
	title: "Theme/Colors",
	parameters: {
		layout: "fullscreen",
	},
};

const { useStyles: useSwatchStyles } = style(
	(theme: Theme, props: { background: string }) => {
		return {
			root: {
				display: "flex",
				alignItems: "center",
				flexDirection: "column",
			},
			color: {
				width: `${theme.space(8)}px`,
				height: `${theme.space(8)}px`,
				borderRadius: `${theme.round("md")}px`,
				background: props.background,
			},
			intensity: {
				paddingTop: "8px",
				// @FIXME(jakehamilton): The `Theme` object needs to
				// include a way to get typography colors as well. Currently
				// it only supports palette colors and that is insufficient.
				// color: theme.typography.color.secondary,
			},
		};
	}
);

const Swatch: FunctionComponent<{ intensity: string; background: string }> = ({
	intensity,
	background,
}) => {
	const styles = useSwatchStyles({ background }, [background]);

	return (
		<div class={styles.root}>
			<div class={styles.color}></div>
			<span class={styles.intensity}>{intensity}</span>
		</div>
	);
};

const { useStyles: useSwatchesStyles } = style((theme) => {
	return {
		root: {
			display: "flex",
			flexDirection: "column",
			gap: "4px",
		},
		title: {
			// color: theme.typography.color.primary,
			fontWeight: "600",
		},
		swatches: {
			display: "flex",
			gap: "8px",
			marginBottom: "16px",
		},
	};
});

const Swatches: FunctionComponent<{ color: Color; name: string }> = ({
	color,
	name,
}) => {
	const styles = useSwatchesStyles();

	return (
		<div class={styles.root}>
			<span class={styles.title}>{name}</span>
			<div class={styles.swatches}>
				{Object.keys(color).map((intensity) => (
					<Swatch
						intensity={intensity}
						background={color[intensity as unknown as keyof Color]}
					/>
				))}
			</div>
		</div>
	);
};

const { useStyles } = style((theme) => {
	return {
		root: {
			padding: `${theme.space(1)}px ${theme.space(2)}px`,
			backgroundColor: theme.color("background.main"),
		},
	};
});
const render = () => {
	const styles = useStyles();

	return (
		<div class={styles.root}>
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
