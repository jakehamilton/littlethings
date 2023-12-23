import { Signal, Transformer } from "~/streams/interface";

export const tap =
	<Value, Error = unknown>(
		fn: (value: Value) => void,
	): Transformer<Value, Value, Error> =>
	(source) =>
	(type, sink) => {
		if (type !== Signal.Start) {
			return;
		}

		source(Signal.Start, (type, data) => {
			// TODO: This is nonsense caused by TypeScript. We can safely call this function, but it refuses to
			// type check properly.
			if (type === Signal.Start) {
				sink(Signal.Start, data);
			} else if (type === Signal.End) {
				sink(Signal.End, data);
			} else {
				fn(data);
				sink(Signal.Data, data);
			}
		});
	};
