import { Signal, Source } from "~/streams/interface";

export const interval =
	(period: number, immediate = true): Source<number> =>
	(type, sink) => {
		if (type !== Signal.Start) return;

		let i = 0;
		let id: ReturnType<typeof setInterval>;

		sink(Signal.Start, (type) => {
			if (type === Signal.End && id) {
				clearInterval(id);
			}
		});

		if (immediate) {
			sink(Signal.Data, i++);
		}

		id = setInterval(() => {
			sink(Signal.Data, i++);
		}, period);
	};
