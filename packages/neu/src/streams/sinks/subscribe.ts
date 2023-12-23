import { Signal, Source, Talkback } from "~/streams/interface";

export type Dispose = () => void;

export const subscribe =
	<Value, EI = unknown, EO = unknown>(fn: (value: Value) => void) =>
	(source: Source<Value, EI, EO>): Dispose => {
		let talkback: Talkback<EO> | null = null;

		source(Signal.Start, (type, data) => {
			if (type === Signal.Start) {
				talkback = data;
			} else if (type === Signal.Data) {
				fn(data);
			}
		});

		return () => {
			talkback?.(Signal.End);
		};
	};
