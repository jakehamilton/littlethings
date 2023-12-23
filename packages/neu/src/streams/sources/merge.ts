import { Signal, Source, Talkback, UnwrapSource } from "~/streams/interface";
import { event } from "./event";

export function merge<S1 extends Source<any, any, any>>(
	...sources: [S1]
): Source<UnwrapSource<S1>>;
export function merge<
	S1 extends Source<any, any, any>,
	S2 extends Source<any, any, any>,
>(...sources: [S1, S2]): Source<UnwrapSource<S1> | UnwrapSource<S2>>;
export function merge<
	S1 extends Source<any, any, any>,
	S2 extends Source<any, any, any>,
	S3 extends Source<any, any, any>,
>(
	...sources: [S1, S2, S3]
): Source<UnwrapSource<S1> | UnwrapSource<S2> | UnwrapSource<S3>>;
export function merge<
	S1 extends Source<any, any, any>,
	S2 extends Source<any, any, any>,
	S3 extends Source<any, any, any>,
	S4 extends Source<any, any, any>,
>(
	...sources: [S1, S2, S3, S4]
): Source<
	UnwrapSource<S1> | UnwrapSource<S2> | UnwrapSource<S3> | UnwrapSource<S4>
>;
export function merge<
	S1 extends Source<any, any, any>,
	S2 extends Source<any, any, any>,
	S3 extends Source<any, any, any>,
	S4 extends Source<any, any, any>,
	S5 extends Source<any, any, any>,
>(
	...sources: [S1, S2, S3, S4, S5]
): Source<
	| UnwrapSource<S1>
	| UnwrapSource<S2>
	| UnwrapSource<S3>
	| UnwrapSource<S4>
	| UnwrapSource<S5>
>;
export function merge<
	S1 extends Source<any, any, any>,
	S2 extends Source<any, any, any>,
	S3 extends Source<any, any, any>,
	S4 extends Source<any, any, any>,
	S5 extends Source<any, any, any>,
	S6 extends Source<any, any, any>,
>(
	...sources: [S1, S2, S3, S4, S5, S6]
): Source<
	| UnwrapSource<S1>
	| UnwrapSource<S2>
	| UnwrapSource<S3>
	| UnwrapSource<S4>
	| UnwrapSource<S5>
	| UnwrapSource<S6>
>;
export function merge<
	S1 extends Source<any, any, any>,
	S2 extends Source<any, any, any>,
	S3 extends Source<any, any, any>,
	S4 extends Source<any, any, any>,
	S5 extends Source<any, any, any>,
	S6 extends Source<any, any, any>,
	S7 extends Source<any, any, any>,
>(
	...sources: [S1, S2, S3, S4, S5, S6, S7]
): Source<
	| UnwrapSource<S1>
	| UnwrapSource<S2>
	| UnwrapSource<S3>
	| UnwrapSource<S4>
	| UnwrapSource<S5>
	| UnwrapSource<S6>
	| UnwrapSource<S7>
>;
export function merge<
	S1 extends Source<any, any, any>,
	S2 extends Source<any, any, any>,
	S3 extends Source<any, any, any>,
	S4 extends Source<any, any, any>,
	S5 extends Source<any, any, any>,
	S6 extends Source<any, any, any>,
	S7 extends Source<any, any, any>,
	S8 extends Source<any, any, any>,
>(
	...sources: [S1, S2, S3, S4, S5, S6, S7, S8]
): Source<
	| UnwrapSource<S1>
	| UnwrapSource<S2>
	| UnwrapSource<S3>
	| UnwrapSource<S4>
	| UnwrapSource<S5>
	| UnwrapSource<S6>
	| UnwrapSource<S7>
	| UnwrapSource<S8>
>;
export function merge<
	S1 extends Source<any, any, any>,
	S2 extends Source<any, any, any>,
	S3 extends Source<any, any, any>,
	S4 extends Source<any, any, any>,
	S5 extends Source<any, any, any>,
	S6 extends Source<any, any, any>,
	S7 extends Source<any, any, any>,
	S8 extends Source<any, any, any>,
	S9 extends Source<any, any, any>,
>(
	...sources: [S1, S2, S3, S4, S5, S6, S7, S8, S9]
): Source<
	| UnwrapSource<S1>
	| UnwrapSource<S2>
	| UnwrapSource<S3>
	| UnwrapSource<S4>
	| UnwrapSource<S5>
	| UnwrapSource<S6>
	| UnwrapSource<S7>
	| UnwrapSource<S8>
	| UnwrapSource<S9>
>;
export function merge<
	S1 extends Source<any, any, any>,
	S2 extends Source<any, any, any>,
	S3 extends Source<any, any, any>,
	S4 extends Source<any, any, any>,
	S5 extends Source<any, any, any>,
	S6 extends Source<any, any, any>,
	S7 extends Source<any, any, any>,
	S8 extends Source<any, any, any>,
	S9 extends Source<any, any, any>,
	S10 extends Source<any, any, any>,
>(
	...sources: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10]
): Source<
	| UnwrapSource<S1>
	| UnwrapSource<S2>
	| UnwrapSource<S3>
	| UnwrapSource<S4>
	| UnwrapSource<S5>
	| UnwrapSource<S6>
	| UnwrapSource<S7>
	| UnwrapSource<S8>
	| UnwrapSource<S9>
	| UnwrapSource<S10>
>;

export function merge(
	...sources: Array<Source<any, any, any>>
): Source<any, any, any> {
	return (type, sink) => {
		if (type !== Signal.Start) {
			return;
		}

		let ended = 0;
		let started = 0;
		let isDone = false;

		const talkbacks: Array<Talkback<unknown> | null> = Array.from(
			{ length: sources.length },
			() => null,
		);

		const talkback: Talkback<unknown> = (type, data) => {
			if (type === Signal.End) {
				isDone = true;
				for (const talkback of talkbacks) {
					talkback?.(Signal.End, data);
				}
			}
		};

		for (let i = 0; i < sources.length; i++) {
			if (isDone) {
				return;
			}

			const source = sources[i];

			source(Signal.Start, (type, data) => {
				if (type === Signal.Start) {
					started++;
					talkbacks[i] = data;

					if (started === 1) {
						sink(Signal.Start, talkback);
					}
				} else if (type === Signal.Data) {
					sink(type, data);
				} else if (type === Signal.End) {
					ended++;
					talkbacks[i] = null;

					if (data) {
						for (let j = 0; j < talkbacks.length; j++) {
							if (i !== j) {
								talkbacks[j]?.(Signal.End, data);
							}
						}
					}

					if (ended === sources.length) {
						sink(Signal.End, data);
					}
				}
			});
		}
	};
}
