import { Signal, Source, Talkback, Transformer } from "~/streams/interface";

export const flat =
	<Value>(): Transformer<Value | Source<Value>, Value> =>
	(source) =>
	(type, sink) => {
		if (type !== Signal.Start) {
			return;
		}

		let talkback: Talkback<unknown> | null = null;
		let innerTalkback: Talkback<unknown> | null = null;

		source(Signal.Start, (type, data) => {
			if (type === Signal.Start) {
				talkback = data;
			} else if (type === Signal.Data) {
				innerTalkback?.(Signal.End);

				if (typeof data !== "function") {
					sink(Signal.Data, data);

					return;
				}

				const innerSource = data as Source<Value>;

				innerSource(Signal.Start, (type, data) => {
					if (type === Signal.Start) {
						innerTalkback = data;
						innerTalkback(Signal.Data);
					}
					if (type === Signal.Data) {
						sink(Signal.Data, data);
					}
					if (type === Signal.End) {
						innerTalkback = null;
					}
				});
			} else if (type === Signal.End) {
				talkback = null;
				innerTalkback?.(Signal.End, data);
			}
		});
	};
