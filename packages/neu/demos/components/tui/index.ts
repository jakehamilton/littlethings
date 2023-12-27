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
	const ui = Ui(sources, {
		stories: [
			{ name: "example 1", app: ButtonStory, props: { text: "Button 1" } },
			{ name: "example 2", app: ButtonStory, props: { text: "Button 2" } },
		],
	});

	return {
		state: ui.state,
		tui: neu.of(
			neu.tui.box(
				{
					flexGrow: 1,
				},
				[ui],
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
