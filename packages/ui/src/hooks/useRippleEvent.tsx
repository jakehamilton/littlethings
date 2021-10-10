import { Ref, useMemo, useRef } from "preact/hooks";
import {
	RippleEvent,
	AddOptions,
	RippleHandle,
	RippleCallback,
} from "../components/Ripple";
import throttle from "../util/throttle";

export type RippleAction = "add" | "remove";

const useRippleEvent = (
	ref: Ref<RippleHandle | null>,
	type: RippleAction,
	options?: AddOptions,
	callback?: RippleCallback,
	duration: number = 50
) => {
	const handler = useMemo(() => {
		const handleEvent = (event: RippleEvent) => {
			if (!ref.current) {
				return;
			}

			if (type === "add") {
				ref.current.add(event, options, callback);
			} else if (type === "remove") {
				ref.current.remove(event, callback);
			}
		};

		return throttle(handleEvent, duration);
	}, [ref, type, options, callback]);

	return handler;
};

export default useRippleEvent;
