import { Signal, Source } from "~/streams/interface";

export const of =
	<Value>(value: Value): Source<Value> =>
	(type, sink) => {
		if (type !== Signal.Start) {
			return;
		}

		let isEnded = false;

		sink(Signal.Start, (type, _data) => {
			if (type === Signal.End) {
				isEnded = true;
			}
		});

		if (isEnded) {
			return;
		}

		sink(Signal.Data, value);
	};
