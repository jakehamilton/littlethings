import { Signal, Source } from "~/streams/interface";

export const event =
	<
		Name extends string,
		E extends Event,
		Target extends {
			addEventListener: (name: Name, listener: (event: E) => void) => void;
			removeEventListener: (name: Name, listener: (event: E) => void) => void;
		},
	>(
		name: Name,
	) =>
	(target: Target): Source<E> => {
		let listener: (event: E) => void;

		return (type, sink) => {
			if (type === Signal.Start) {
				sink(Signal.Start, (type, _data) => {
					if (type === Signal.End) {
						target.removeEventListener(name, listener);
					}
				});
				listener = (event) => {
					sink(Signal.Data, event);
				};
				target.addEventListener(name, listener);
			} else if (type === Signal.End) {
				target.removeEventListener(name, listener);
			}
		};
	};
