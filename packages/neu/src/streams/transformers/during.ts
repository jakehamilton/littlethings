import { Signal, Source, Talkback, Transformer } from "~/streams/interface";

const empty = Symbol("empty");

export const during =
	<Value>(signal: Source<boolean>): Transformer<Value, Value> =>
	(source) =>
	(type, sink) => {
		if (type !== Signal.Start) {
			return;
		}

		let talkback: Talkback<unknown> | null = null;
		let value: Value | typeof empty = empty;

		source(Signal.Start, (type, data) => {
			if (type === Signal.Start) {
				sink(Signal.Start, data);
				talkback = data;
			} else if (type === Signal.Data) {
				value = data;
			} else if (type === Signal.End) {
				sink(Signal.End, data);
			}
		});

		signal(Signal.Start, (type, data) => {
			if (type === Signal.Data) {
				if (value !== empty && data) {
					sink(Signal.Data, value);
				}
			} else if (type === Signal.End) {
				talkback?.(Signal.End, undefined);
				sink(Signal.End, undefined);
			}
		});
	};
