import * as neu from "~/index";

import { Drivers } from "..";

export type CalloutProps = {
	title: neu.tui.VNode | neu.tui.VNodeStream;
	description: neu.tui.VNode | neu.tui.VNodeStream;
	invert?: boolean;
};

export const Callout: neu.App<Drivers, neu.tui.TuiSink, CalloutProps> = (
	sources,
	props,
) => {
	const style$ = neu.pipe(
		sources.tui.resize(true),
		neu.map((size: { columns: number; rows: number }) => {
			if (size.columns < 100) {
				return {
					marginRight: 0,
					marginLeft: 0,
				};
			} else {
				return {
					marginRight: props.invert ? 0 : 50,
					marginLeft: props.invert ? 50 : 0,
				};
			}
		}),
	);

	return {
		tui: neu.of(
			neu.tui.box(
				{
					justifyContent: "center",
					paddingTop: 4,
					paddingBottom: 4,
					maxWidth: 50,
					style: style$,
				},
				[
					neu.tui.text(
						{
							alignSelf: props.invert ? "flex-end" : "flex-start",
							color: "magenta",
							bold: true,
						},
						props.title,
					),
					neu.tui.text(
						{
							marginTop: 1,
						},
						props.description,
					),
				],
			),
		),
	};
};
