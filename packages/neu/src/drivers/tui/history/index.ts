import { Driver } from "~/lifecycle/run";
import { Signal, Source, Transformer } from "~/streams/interface";
import { each } from "~/streams/sinks/each";
import { of } from "~/streams/sources/of";
import { sample } from "~/streams/transformers/sample";
import { start } from "~/streams/transformers/start";
import { pipe } from "~/streams/util/pipe";

export type Path = string;

export type HistoryDriver = Driver<Path, unknown, HistorySource>;

export type HistorySource = {
	location: () => Source<Path>;
	navigation: () => Source<Path>;
	navigate: (path: Path) => Transformer<unknown, Path>;
};

export type HistorySink = {
	history: Source<Path>;
};

const helpers = (
	source: Source<Path>,
	listeners: Array<(path: Path) => void>,
): HistorySource => {
	return {
		location: (): Source<Path> => {
			return pipe(source, start("/"));
		},
		navigation: (): Source<Path> => (type, sink) => {
			if (type !== Signal.Start) {
				return;
			}

			const listener = (path: Path) => {
				sink(Signal.Data, path);
			};

			sink(Signal.Start, (type, _data) => {
				if (type === Signal.End) {
					listeners.splice(listeners.indexOf(listener), 1);
				}
			});

			listeners.push(listener);
		},
		navigate:
			(path: Path): Transformer<unknown, Path> =>
			(source) =>
				pipe(of(path), sample<Path>(source)),
	};
};

export const driver = (): HistoryDriver => (source) => {
	const listeners = new Array<(path: Path) => void>();

	const path$: Source<Path> = pipe(source, start("/"));

	each((path: string) => {
		for (const listener of listeners) {
			listener(path);
		}
	})(path$);

	return helpers(path$, listeners);
};
