import * as neu from "~/index";

import { Drivers, State } from "..";

export type ExampleProps = {
	text: string;
};

export const Example: neu.App<
	Drivers,
	neu.tui.TuiSink, //& neu.state.StateSink<State>
	ExampleProps
> = (sources, props) => {
	return {
		tui: neu.of(neu.tui.box([`example: ${props.text}`])),
	};
};
