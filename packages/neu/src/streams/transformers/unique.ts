import { Signal, Transformer } from "~/streams/interface";

const empty = Symbol("empty");

export const unique =
	<T>(): Transformer<T, T> =>
	(source) =>
	(type, sink) => {
		if (type !== Signal.Start) {
			return;
		}

		let lastValue: T | typeof empty = empty;

		source(Signal.Start, (type, data) => {
			if (type === Signal.Start) {
				sink(Signal.Start, data);
			} else if (type === Signal.Data) {
				if (lastValue !== data) {
					lastValue = data;
					sink(Signal.Data, data);
				}
			} else if (type === Signal.End) {
				sink(Signal.End, data);
			}
		});
	};
