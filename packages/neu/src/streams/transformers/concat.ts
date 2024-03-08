import { Signal, Source, Talkback, Transformer } from "~/streams/interface";

const empty = Symbol("empty");

export const concat =
	<First, Second>(
		source2: Source<Second>,
	): Transformer<First, [First, Second]> =>
	(source1) =>
	(type, sink) => {
		if (type !== Signal.Start) {
			return;
		}

		const values: [First | typeof empty, Second | typeof empty] = [
			empty,
			empty,
		];

		source1(Signal.Start, (type, data) => {
			if (type === Signal.Start) {
				sink(Signal.Start, data);
			} else if (type === Signal.Data) {
				values[0] = data;
				if (values[1] !== empty) {
					sink(Signal.Data, values as [First, Second]);
				}
			} else if (type === Signal.End) {
				sink(Signal.End, data);
			}
		});

		source2(Signal.Start, (type, data) => {
			if (type === Signal.Data) {
				values[1] = data;
				if (values[0] !== empty) {
					sink(Signal.Data, values as [First, Second]);
				}
			} else if (type === Signal.End) {
				sink(Signal.End, data);
			}
		});
	};
