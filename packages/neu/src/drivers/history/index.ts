import { pipe } from "~/streams/util/pipe";
import { Signal, Sink, Source } from "../../streams/interface";
import { map } from "~/streams/transformers/map";
import { start } from "~/streams/transformers/start";

export type Path = string;

export type HistoryDriver = (source: Source<Path>) => {
	location: () => Source<Location>;
	navigation: () => Source<Location>;
};

const helpers: HistoryDriver = (source: Source<Path>) => {
	return {
		location: (): Source<Location> => {
			return pipe(
				source,
				map((_path: Path) => window.location),
				start(window.location),
			);
		},
		navigation: (): Source<Location> => {
			let sink: Sink<Location> | null = null;

			const handlePopState = (_event: PopStateEvent) => {
				sink?.(Signal.Data, window.location);
			};

			return (type, data) => {
				if (type === Signal.Start) {
					sink = data;

					sink(Signal.Start, (type, _data) => {
						if (type === Signal.End) {
							window.removeEventListener("popstate", handlePopState);
						}
					});

					window.addEventListener("popstate", handlePopState);
				} else if (type === Signal.End) {
					sink = null;
					window.removeEventListener("popstate", handlePopState);
				}
			};
		},
	};
};

export const driver = (): HistoryDriver => (source) => {
	const path$ = pipe(source, (s: Source<Path>): Source<Path> => {
		let sink: Sink<Path> | null = null;

		const handleClick = (event: MouseEvent) => {
			if (event.target instanceof HTMLAnchorElement) {
				const url = new URL(event.target.href);

				// Location navigation, handle it client side.
				if (url.origin === window.location.origin) {
					event.preventDefault();
					window.history.pushState({}, "", url.pathname);
					sink?.(Signal.Data, window.location.pathname);
				}
			}
		};

		return (type, data) => {
			if (type === Signal.Start) {
				sink = data;

				sink(Signal.Start, (type, _data) => {
					if (type === Signal.End) {
						window.removeEventListener("click", handleClick);
					}
				});

				window.addEventListener("click", handleClick);
			} else if (type === Signal.End) {
				window.removeEventListener("click", handleClick);
			}
		};
	});

	return helpers(path$);
};
