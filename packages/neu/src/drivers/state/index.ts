import { Driver } from "~/lifecycle/run";
import { tap } from "~/streams/transformers/tap";
import { pipe } from "~/streams/util/pipe";
import { Signal, Source, Transformer } from "~/streams/interface";

export type StateDriver<State> = Driver<
	State,
	unknown,
	ReturnType<typeof helpers>
>;

export type DomSource<Store> = {
	write: <Key extends keyof Store>(
		key: Key,
	) => Transformer<Store[Key], Store[Key]>;
	select: <Key extends keyof Store>(key: Key) => Source<Store[Key]>;
};

const helpers = <
	Store extends {
		[key: string]: any;
	},
>(
	_store: Source<Store>,
	state: Map<keyof Store, Store[keyof Store]>,
	listeners: Map<string, Array<(value: any) => void>>,
): DomSource<Store> => ({
	write: (key) => (source) => {
		return pipe(
			source,
			tap((value: Store[typeof key]) => {
				state.set(key, value);

				if (listeners.has(key as string)) {
					listeners.get(key as string)!.forEach((listener) => listener(value));
				}
			}),
		);
	},
	select: (key) => (type, sink) => {
		if (type !== Signal.Start) {
			return;
		}

		const listener = (value: any) => {
			sink(Signal.Data, value);
		};

		sink(Signal.Start, (type, _data) => {
			if (type === Signal.End) {
				const keyListeners = listeners.get(key as string) ?? [];
				const index = keyListeners.indexOf(listener);

				if (index !== -1) {
					keyListeners.splice(index, 1);
					listeners.set(key as string, keyListeners);
				}
			}
		});

		if (state.has(key as keyof Store)) {
			sink(Signal.Data, state.get(key)!);
		}

		const keyListeners = listeners.get(key as string) ?? [];
		listeners.set(key as string, keyListeners.concat(listener));
	},
});

export const driver =
	<
		Store extends {
			[key: string]: any;
		},
	>(
		initial: Store,
	) =>
	(source: Source<Store>) => {
		const state = new Map<keyof Store, Store[keyof Store]>(
			Object.entries(initial ?? {}),
		);
		const listeners = new Map<string, Array<(value: any) => void>>();

		return helpers<Store>(source, state, listeners);
	};
