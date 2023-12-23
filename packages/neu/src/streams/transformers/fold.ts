import { Signal, Transformer } from "~/streams/interface";

export const fold =
	<Value, Accumulator>(
		fn: (accumulator: Accumulator, value: Value) => Accumulator,
		initial: Accumulator,
	): Transformer<Value, Accumulator> =>
	(source) => {
		let accumulator = initial;

		return (type, sink) => {
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
					accumulator = fn(accumulator, data);
					sink(Signal.Data, accumulator);
				}
			});
		};
	};
