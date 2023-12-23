import { Signal, Source, Talkback, Transformer } from "~/streams/interface";

export const when =
	<Value>(
		signal: Source<boolean>,
		initial = false,
	): Transformer<Value, Value> =>
	(source) =>
	(type, sink) => {
		if (type !== Signal.Start) {
			return;
		}

		let sourceTalkback: Talkback<unknown> | null = null;
		let signalTalkback: Talkback<unknown> | null = null;

		let isOpen = initial;

		signal(Signal.Start, (type, data) => {
			if (type === Signal.Start) {
				signalTalkback = data;
			} else if (type === Signal.End) {
				sourceTalkback?.(Signal.End, data);

				sourceTalkback = null;
				signalTalkback = null;
			} else {
				isOpen = data;
			}
		});

		source(Signal.Start, (type, data) => {
			if (type === Signal.Start) {
				sink(Signal.Start, data);
				sourceTalkback = data;
			} else if (type === Signal.End) {
				signalTalkback?.(Signal.End, data);
				sink(Signal.End, data);

				sourceTalkback = null;
				signalTalkback = null;
			} else if (isOpen) {
				sink(Signal.Data, data);
			}
		});
	};
