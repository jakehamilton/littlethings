import { Signal, Transformer } from "~/streams/interface";

export const to =
	<Value>(value: Value): Transformer<unknown, Value> =>
	(source) =>
	(type, sink) => {
		if (type !== Signal.Start) {
			return;
		}

		source(Signal.Start, (type, data) => {
			if (type === Signal.Start) {
				sink(Signal.Start, data);
			} else if (type === Signal.Data) {
				sink(Signal.Data, value);
			} else if (type === Signal.End) {
				sink(Signal.End, data);
			}
		});
	};
