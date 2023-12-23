import { Driver } from "~/lifecycle/run";
import { Signal, Sink, Source, Talkback } from "~/streams/interface";
import { of } from "~/streams/sources/of";
import { pipe } from "~/streams/util/pipe";

import { VNode } from "./elements";
import { render } from "./render";

export * from "./elements";

export type DomDriver = Driver<VNode, unknown, ReturnType<typeof helpers>>;

const helpers = <Root extends Element>(source: Source<Root>) => {
	return {
		select: <T extends Element>(
			selector: string,
		): Source<T | null, unknown, unknown> => {
			let element: Root | null = null;
			let sinkTalkback: Sink<T | null, unknown, unknown> | null = null;
			const observer = new MutationObserver((_mutations) => {
				sinkTalkback?.(
					Signal.Data,
					(element?.querySelector(selector) ?? null) as T | null,
				);
			});

			const stream = pipe(source, (s): Source<T | null, any, any> => {
				s(Signal.Start, (type, data) => {
					if (type === Signal.Start) {
					} else if (type === Signal.Data) {
						observer.disconnect();

						element = data;
						if (element) {
							observer.observe(element, {
								// TODO: Determine if this is necessary for nested child elements to
								// retrigger querySelector. Doing so means more full rerenders which means
								// reattaching listeners when potentially unrelated changes are made.
								subtree: false,
								childList: true,
							});
						}
					} else if (type === Signal.End) {
						sinkTalkback?.(Signal.End, undefined);
					}
				});

				return (type, sink) => {
					if (type === Signal.Start) {
						sinkTalkback = sink;
					} else if (type === Signal.End) {
						observer.disconnect();
					}
				};
			});

			return stream;
		},
		event: (name: string) => {
			const stream = pipe(source, (s): Source<Event> => {
				let sourceTalkback: Talkback | null = null;
				let sinkTalkback: Sink<Event> | null = null;

				let element: Element | null = null;
				const listener = (event: Event) => {
					sinkTalkback?.(Signal.Data, event);
				};

				s(Signal.Start, (type, data) => {
					if (type === Signal.Start) {
						sourceTalkback = data;
					} else if (type === Signal.Data) {
						element?.removeEventListener(name, listener);
						element = data;
						element?.addEventListener(name, listener);
					} else if (type === Signal.End) {
						sinkTalkback?.(Signal.End, undefined);
						element?.removeEventListener(name, listener);
					}
				});

				return (type, sink) => {
					if (type === Signal.Start) {
						sinkTalkback = sink;
					} else if (type === Signal.End) {
						sourceTalkback?.(Signal.End);
						element?.removeEventListener(name, listener);
					}
				};
			});

			return stream;
		},
	} as const;
};

export const driver =
	(selector: string): DomDriver =>
	(source) => {
		const element = document.querySelector(selector)!;

		render(element)(source);

		return helpers(of(element));
	};
