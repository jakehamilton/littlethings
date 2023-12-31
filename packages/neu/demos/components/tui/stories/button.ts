import * as neu from "~/index";

import { Drivers, State } from "..";

export type ButtonStoryProps = neu.tui.ButtonProps & {};

export const ButtonStory: neu.App<
	Drivers,
	neu.tui.TuiSink & {
		blur: neu.Source<neu.tui.Direction>;
	},
	ButtonStoryProps
> = (sources, props) => {
	const button = neu.tui.Button(sources, {
		...props,
	});

	const count$ = neu.pipe(
		button.press,
		neu.fold<unknown, number>((acc) => acc + 1, 0),
		neu.start(0),
		neu.map((count) => `Pressed ${count} time${count === 1 ? "" : "s"}`),
	);

	return {
		blur: button.blur,
		tui: neu.of(
			neu.tui.box(
				{
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					flexGrow: 1,
					width: "auto",
					height: "auto",
				},
				[
					button.tui,
					neu.tui.box(
						{
							flexDirection: "row",
							marginTop: 1,
							border: "dashed",
							paddingLeft: 1,
							paddingRight: 1,
						},
						[
							neu.tui.text({}, ""),
							neu.tui.text(
								{
									paddingLeft: 1,
								},
								count$,
							),
						],
					),
				],
			),
		),
	};
};
