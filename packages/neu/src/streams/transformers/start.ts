import { Signal, Talkback, Transformer } from "~/streams/interface";

export const start =
	<Value>(...values: Array<Value>): Transformer<Value, Value> =>
	(source) =>
	(type, sink) => {
		if (type !== Signal.Start) {
			return;
		}

		let talkback: Talkback | null = null;

		sink(Signal.Start, (type, data) => {
			if (type === Signal.End) {
				talkback?.(Signal.End, data);
				talkback = null;
			}
		});

		for (const value of values) {
			sink(Signal.Data, value);
		}

		source(Signal.Start, (type, data) => {
			if (type === Signal.Start) {
				talkback = data;
			} else if (type === Signal.Data) {
				sink(Signal.Data, data);
			} else if (type === Signal.End) {
				sink(Signal.End, data);
				talkback = null;
			}
		});
	};
