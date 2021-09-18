import { Ref, useMemo, useRef } from "preact/hooks";
import { RippleEvent, RippleHandle } from "../components/Ripple/index.old";
import throttle from "../util/throttle";

export type RippleAction = "start" | "stop";

export type RippleOptions = {};

const useRippleEvent = (
	ref: Ref<RippleHandle | null>,
	type: RippleAction,
	options: RippleOptions,
	callback: (event: RippleEvent) => void,
	duration: number = 50
) => {
	const handler = useMemo(() => {
		const handleEvent = (event: RippleEvent) => {
			if (!ref.current) {
				return;
			}

			if (type === "start") {
				ref.current.start(event, options, () => callback(event));
			} else if (type === "stop") {
				ref.current.stop(event, () => callback(event));
			}
		};

		return throttle(handleEvent, duration);
	}, [ref, type, options, callback]);

	return handler;
};

export default useRippleEvent;
