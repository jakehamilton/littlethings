import { Signal, Source } from "~/streams/interface";

import { VNode } from "./elements";
import { TuiNode, render } from "./render";
import { Dispose } from "~/streams/sinks/subscribe";
import parseKeypress, { Key } from "./keypress";

export * from "./render";
export * from "./elements";
export * from "./keypress";

export type TuiSource = {
	select: (id: string) => Source<TuiNode>;
	keypress: () => Source<Key>;
	resize: (immediate?: boolean) => Source<{ columns: number; rows: number }>;
};

export type TuiDriver = (source: Source<VNode>) => TuiSource;

export const driver =
	(stdin: NodeJS.ReadStream, stdout: NodeJS.WriteStream): TuiDriver =>
	(source) => {
		const nodes = new Map<string, TuiNode>();
		const nodeListeners = new Map<string, Array<(node: TuiNode) => void>>();
		const keypressListeners = Array<(key: Key) => void>();

		stdin.setRawMode(true);
		stdin.setEncoding("utf8");

		const register = (id: string, node: TuiNode): Dispose => {
			nodes.set(id, node);

			for (const listener of nodeListeners.get(id) ?? []) {
				listener(node);
			}

			return () => {
				nodes.delete(id);
			};
		};

		stdin.addListener("data", (data) => {
			const key = parseKeypress(data);

			for (let i = 0; i < keypressListeners.length; i++) {
				keypressListeners[i](key);
			}
		});

		render(stdin, stdout, source, register);

		const helpers: TuiSource = {
			select: (id) => (type, sink) => {
				if (type !== Signal.Start) return;

				const listener = (node: TuiNode) => {
					sink(Signal.Data, node);
				};

				sink(Signal.Start, (type, _data) => {
					if (type === Signal.End) {
						const listeners = nodeListeners.get(id) ?? [];
						listeners.splice(listeners.indexOf(listener), 1);
					}
				});

				const listeners = nodeListeners.get(id) ?? [];
				nodeListeners.set(id, listeners.concat(listener));

				if (nodes.has(id)) {
					listener(nodes.get(id)!);
				}
			},
			keypress: () => (type, sink) => {
				if (type !== Signal.Start) return;

				const listener = (key: Key) => {
					sink(Signal.Data, key);
				};

				keypressListeners.push(listener);

				sink(Signal.Start, (type, _data) => {
					if (type === Signal.End) {
						const index = keypressListeners.indexOf(listener);

						if (index !== -1) {
							keypressListeners.splice(index, 1);
						}
					}
				});
			},
			resize: (immediate) => (type, sink) => {
				if (type !== Signal.Start) return;

				const listener = () => {
					sink(Signal.Data, {
						columns: stdout.columns ?? 80,
						rows: stdout.rows ?? 30,
					});
				};

				sink(Signal.Start, (type, _data) => {
					if (type === Signal.End) {
						stdout.removeListener("resize", listener);
					}
				});

				if (immediate) {
					listener();
				}

				stdout.addListener("resize", listener);
			},
		};

		return helpers;
	};
