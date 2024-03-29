import { Driver } from "~/lifecycle/run";
import { Signal, Source, Transformer } from "~/streams/interface";
import { map } from "~/streams/transformers/map";
import { pipe } from "~/streams/util/pipe";

export type StateAction<State> = {
	key: keyof State;
	value: State[keyof State];
};

export type StateDriver<State> = Driver<
	StateAction<State>,
	unknown,
	StateSource<State>
>;

export type StateSink<State> = {
	state: Source<StateAction<State>>;
};

export type StateSource<Store> = {
	write: <Key extends keyof Store>(
		key: Key,
	) => Transformer<
		Store[Key],
		{
			key: Key;
			value: Store[Key];
		}
	>;
	select: <Key extends keyof Store>(key: Key) => Source<Store[Key]>;
};

const helpers = <
	Store extends {
		[key: string]: any;
	},
>(
	state: Map<keyof Store, Store[keyof Store]>,
	listeners: Map<string, Array<(value: any) => void>>,
): StateSource<Store> => ({
	write: (key) => (source) => {
		return pipe(
			source,
			map((value: Store[typeof key]) => ({
				key,
				value,
			})),
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
	(source: Source<StateAction<Store>>) => {
		const state = new Map<keyof Store, Store[keyof Store]>(
			Object.entries(initial ?? {}),
		);
		const listeners = new Map<string, Array<(value: any) => void>>();

		source(Signal.Start, (type, data) => {
			if (type === Signal.Data) {
				if (listeners.has(data.key as string)) {
					listeners
						.get(data.key as string)!
						.forEach((listener) => listener(data.value));
				}
			}
		});

		return helpers<Store>(state, listeners);
	};
