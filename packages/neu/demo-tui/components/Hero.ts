import * as neu from "~/index";

import { Drivers } from "..";

export const Hero: neu.App<Drivers> = () => {
	return {
		tui: neu.of(
			neu.tui.box(
				{
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
					paddingTop: 4,
					paddingBottom: 4,
				},
				[
					neu.tui.text("THE "),
					neu.tui.text(
						{
							color: "magenta",
							bold: true,
						},
						"NEU",
					),
					neu.tui.text(" WEB"),
				],
			),
		),
	};
};
