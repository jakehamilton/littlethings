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
	options?: AddOptions,
	callback?: RippleCallback,
	duration: number = 50
) => {
	const handlers = useMemo(() => {
		const createHandler = (type: RippleAction) => (event: RippleEvent) => {
			if (!ref.current) {
				return;
			}

			if (type === "add") {
				ref.current.add(event, options, callback);
			} else if (type === "remove") {
				ref.current.remove(event, callback);
			}
		};

		return {
			add: throttle(createHandler("add"), duration),
			remove: throttle(createHandler("remove"), duration),
		};
	}, [ref, options, callback]);

	return handlers;
};

export default useRippleEvent;
