import { Signal, Source } from "~/streams/interface";

export const each =
	<Input, EI = unknown, EO = unknown>(fn: (value: Input) => void) =>
	(source: Source<Input, EI, EO>) => {
		source(Signal.Start, (type, data) => {
			if (type === Signal.Data) {
				fn(data);
			}
		});
	};
