import * as neu from "~/index";

import { Drivers } from "..";

export type CalloutProps = {
	title: neu.dom.VNode | neu.dom.VNodeStream;
	description: neu.dom.VNode | neu.dom.VNodeStream;
	invert?: boolean;
};

export const Callout: neu.App<Drivers, {}, CalloutProps> = (sources, props) => {
	const style$ = neu.pipe(
		sources.tui.resize(true),
		neu.map((size) => {
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
