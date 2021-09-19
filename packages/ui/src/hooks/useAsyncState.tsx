import { useEffect, useRef } from "@storybook/addons";
import { useCallback, useState } from "preact/hooks";

export type AsyncStateUpdater<State> = (
	value: State | ((prevState: State) => State),
	callback?: (() => void) | null
) => void;

const useAsyncState = <State extends any>(
	initialState: State | (() => State)
): [State, AsyncStateUpdater<State>] => {
	const [state, setState] = useState(initialState);
	const callbackRef = useRef<(() => void) | null>(null);

	const asyncSetState: AsyncStateUpdater<State> = useCallback(
		(value, callback = null) => {
			setState(value);
			callbackRef.current = callback;
		},
		[]
	);

	useEffect(() => {
		callbackRef.current?.();
	}, [state]);

	return [state, asyncSetState];
};

export default useAsyncState;
