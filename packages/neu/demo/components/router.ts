import * as neu from "~/index";

export type Props = {
	routes: Record<string, neu.Source<neu.dom.VNode>>;
	fallback: neu.dom.VNodeStream;
};

export const Router: neu.App<
	{ history: neu.history.HistoryDriver },
	{
		dom: neu.dom.VNodeStream;
	},
	Props
> = ({ history }, { routes, fallback }) => {
	const vdom$ = neu.pipe(
		history.location(),
		neu.map((location: Location) => {
			for (const [route, vdom] of Object.entries(routes)) {
				const pattern = new URLPattern(route, window.location.origin);

				if (pattern.test(location.href)) {
					return vdom;
				}
			}

			return fallback;
		}),
		neu.flat<neu.dom.VNode>(),
	);

	return {
		dom: vdom$,
	};
};
