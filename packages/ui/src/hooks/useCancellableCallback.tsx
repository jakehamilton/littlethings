import { useRef, useEffect, useMemo } from "preact/hooks";
import { AnyFunction } from "../types/fn";

export type CancellableCallback<Callback extends AnyFunction = AnyFunction> = {
	(...args: Parameters<Callback>): void;
	cancel: () => void;
};

const useCancellableCallback = <Callback extends AnyFunction>(
	cancelOnUnmount = true
) => {
	const callbackRef = useRef<CancellableCallback<Callback>>(null);

	const result = useMemo(() => {
		const setCallback = (callback: Callback) => {
			let active = true;

			const handler: CancellableCallback<Callback> = () => {
				if (active) {
					active = false;

					callbackRef.current = null;
					callback();
				}
			};

			handler.cancel = () => {
				active = false;
			};

			callbackRef.current = handler;

			return handler;
		};

		const cancelCallback = () => {
			if (callbackRef.current !== null) {
				callbackRef.current.cancel();
				callbackRef.current = null;
			}
		};

		return [callbackRef, setCallback, cancelCallback] as const;
	}, []);

	useEffect(() => {
		if (cancelOnUnmount) {
			return () => {
				result[2]();
			};
		}
	}, []);

	return result;
};

export default useCancellableCallback;
