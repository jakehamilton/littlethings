import { Signal, Transformer } from "~/streams/interface";

export const filter =
	<Input, Output>(fn: (value: Input) => boolean): Transformer<Input, Output> =>
	(source) =>
	(type, sink) => {
		if (type !== Signal.Start) {
			return;
		}

		source(Signal.Start, (type, data) => {
			if (type === Signal.Start) {
				sink(Signal.Start, data);
			} else if (type === Signal.End) {
				sink(Signal.End, data);
			} else if (fn(data)) {
				sink(Signal.Data, data as unknown as Output);
			}
		});
	};
