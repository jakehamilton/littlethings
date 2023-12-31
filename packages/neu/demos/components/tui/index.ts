import * as neu from "~/index";
import { Ui } from "./ui";
import { Example } from "./stories/example";
import { ButtonStory } from "./stories/button";

export type State = {
	"ui.story": number;
	"ui.focus": string;
};

export interface Theme extends neu.theme.Theme {
	dark: neu.theme.DefaultThemePalette;
}

export type Drivers = {
	tui: neu.tui.TuiDriver;
	state: neu.state.StateDriver<State>;
	history: neu.tui.history.HistoryDriver;
	effect: neu.effect.EffectDriver;
	theme: neu.theme.ThemeDriver<Theme>;
};

const app: neu.App<Drivers> = (sources) => {
	const exit$ = neu.pipe(
		sources.tui.keypress(),
		neu.filter<tui.Key, tui.Key>((key) => key.name === "q" && key.shift),
		neu.to(() => {
			process.exit(0);
		}),
	);

	const ui = Ui(sources, {
		stories: [
			{
				name: "example 1",
				app: ButtonStory,
				props: { text: "Button 1", variant: "outline" },
			},
			{
				name: "example 2",
				app: ButtonStory,
				props: { text: "Button 2", variant: "solid" },
			},
		],
	});

	return {
		effect: exit$,
		state: ui.state,
		tui: neu.of(
			neu.tui.box(
				{
					flexGrow: 1,
				},
				[
					ui,
					neu.tui.box(
						{
							flexDirection: "row",
							paddingLeft: 1,
							paddingRight: 1,
						},
						[
							neu.tui.box(
								{
									flexDirection: "row",
									flexShrink: 0,
								},
								[
									neu.tui.text(
										{
											dim: true,
										},
										"Shift +  / H: Move Left",
									),
									neu.tui.text(
										{ dim: true, marginLeft: 2, marginRight: 2 },
										"┆",
									),
									neu.tui.text(
										{
											dim: true,
										},
										"Shift +  / L: Move Right",
									),
								],
							),
							neu.tui.box(
								{
									flexGrow: 1,
									flexDirection: "row",
									justifyContent: "flex-end",
									dim: true,
								},
								[neu.tui.text("Shift + Q: Quit")],
							),
						],
					),
				],
			),
		),
	};
};

neu.run<Drivers>({
	app,
	tui: neu.tui.driver({ debug: false }),
	state: neu.state.driver<State>({
		"ui.story": 0,
		"ui.focus": "neu.ui.sidebar",
	}),
	history: neu.tui.history.driver(),
	effect: neu.effect.driver(),
	theme: neu.theme.driver<Theme>(
		{
			dark: {
				accent: {
					foreground: "white",
					background: "magenta",
				},
				foreground: {
					light: "white",
					normal: "white",
					dark: "white",
				},
				background: {
					light: "black",
					normal: "black",
					dark: "black",
				},
			},
		},
		"dark",
	),
});
