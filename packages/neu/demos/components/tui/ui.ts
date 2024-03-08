import * as neu from "~/index";

import { Drivers, State } from ".";

export type Story =
	| {
			name: string;
			app: neu.App<Drivers, neu.tui.TuiSink & neu.tui.BlurSink, any>;
			props: any;
	  }
	| {
			name: string;
			app: neu.App<Drivers, neu.tui.TuiSink & neu.tui.BlurSink>;
	  };

export type Stories = Array<Story>;

type SidebarProps = {
	stories: Stories;
	focus: neu.Source<boolean>;
};

const Sidebar: neu.App<
	Drivers,
	neu.tui.TuiSink &
		neu.tui.BlurSink & {
			selected: neu.Source<number>;
		},
	SidebarProps
> = (sources, props) => {
	// TODO: Make sidebar width responsive.

	const list = neu.tui.List(sources, {
		focus: props.focus,
		scrollbar: false,
		items: neu.of(
			props.stories.map((story) => {
				return {
					child: ({ focus }) => {
						const style$ = neu.pipe(
							neu.combine(focus, sources.theme.palette()),
							neu.map(
								([focus, palette]: [boolean, neu.theme.ThemePalette]) => ({
									color: focus
										? palette.accent.background
										: palette.foreground.normal,
								}),
							),
						);

						const name$ = neu.pipe(
							focus,
							neu.map((focus) => (focus ? ` ${story.name}` : story.name)),
						);

						return neu.tui.box(
							{
								paddingLeft: 1,
								style: style$,
							},
							name$,
						);
					},
				};
			}),
		),
	});

	const selected$ = neu.merge(list.pick, neu.of(0));

	const style$ = neu.pipe(
		neu.combine(props.focus, sources.theme.palette()),
		neu.map(([focus, palette]: [boolean, neu.theme.DefaultThemePalette]) => ({
			borderColor: focus
				? palette.accent.background
				: palette.foreground.normal,
		})),
	);

	return {
		blur: list.blur,
		selected: selected$,
		tui: neu.of(
			neu.tui.box(
				{
					width: 35,
					border: "round",
					overflow: "hidden",
					paddingLeft: 1,
					paddingRight: 1,
					style: style$,
				},
				[neu.tui.text({ bold: true }, "Stories"), list],
			),
		),
	};
};

export type UiProps = {
	stories: Stories;
};

export const Ui: neu.App<
	Drivers,
	neu.tui.TuiSink & neu.state.StateSink<State>,
	UiProps
> = (sources, props) => {
	const focus$ = neu.pipe(sources.state.select("ui.focus"));

	const sidebarFocus$ = neu.pipe(
		focus$,
		neu.map<string, boolean>((focus: string) => focus === "neu.ui.sidebar"),
	);

	const storyFocus$ = neu.broadcast(
		neu.pipe(
			focus$,
			neu.map<string, boolean>((focus: string) => focus === "neu.ui.story"),
		),
	);

	const sidebar = Sidebar(sources, {
		stories: props.stories,
		focus: sidebarFocus$,
	});

	const sidebarFocusState$ = neu.pipe(
		sidebar.blur,
		neu.map((direction: neu.tui.Direction) => {
			if (direction === "right") {
				return "neu.ui.story";
			}

			return null;
		}),
		neu.filter<string | null, string>((next) => next !== null),
		sources.state.write("ui.focus"),
	);

	const app$ = neu.pipe(
		sidebar.selected,
		neu.map((index: number) => {
			const story = props.stories[index];

			if ("props" in story) {
				return story.app(sources, { ...story.props, focus: storyFocus$ });
			}

			return story.app(sources);
		}),
	);

	const appTui$ = neu.pipe(
		app$,
		neu.map((app: neu.tui.TuiSink) => app.tui),
		neu.flat<neu.tui.VNode>(),
	);

	const appBlur$ = neu.pipe(
		app$,
		neu.map((app: neu.tui.BlurSink) => app.blur),
		neu.flat<neu.tui.Direction>(),
	);

	const appFocusState$ = neu.pipe(
		neu.combine(focus$, appBlur$),
		neu.sample<[string, neu.tui.Direction]>(appBlur$),
		neu.map(([current, movement]: [string, neu.tui.Direction]) => {
			if (current === "neu.ui.sidebar" && movement === "right") {
				return "neu.ui.story";
			}

			if (current === "neu.ui.story" && movement === "left") {
				return "neu.ui.sidebar";
			}

			return null;
		}),
		neu.filter<string | null, string>((next) => next !== null),
		sources.state.write("ui.focus"),
	);

	const storyStyle$ = neu.pipe(
		neu.combine(storyFocus$, sources.theme.palette()),
		neu.map(([focus, palette]: [boolean, neu.theme.DefaultThemePalette]) => ({
			borderColor: focus
				? palette.accent.background
				: palette.foreground.normal,
		})),
	);

	return {
		state: neu.merge(sidebarFocusState$, appFocusState$),
		tui: neu.of(
			neu.tui.box(
				{
					flexGrow: 1,
					flexDirection: "row",
				},
				[
					sidebar,
					neu.tui.box(
						{
							flexGrow: 1,
							paddingLeft: 1,
							border: "round",
							style: storyStyle$,
						},
						[appTui$],
					),
				],
			),
		),
	};
};
