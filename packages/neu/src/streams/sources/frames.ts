import { Signal, Source } from "~/streams/interface";

export const frames =
	(period: number): Source<number> =>
	(type, sink) => {
		if (type !== Signal.Start) return;

		let i = 0;
		let id: ReturnType<typeof requestAnimationFrame>;

		sink(Signal.Start, (type) => {
			if (type === Signal.End) {
				cancelAnimationFrame(id);
			}
		});

		id = requestAnimationFrame(() => {
			sink(Signal.Data, i++);
		});
	};
