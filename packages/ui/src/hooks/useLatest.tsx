import { useEffect, useRef, Ref } from "preact/hooks";

const useLatest = <Value extends unknown>(value: Value): Ref<Value> => {
	const ref = useRef(value);

	useEffect(() => {
		ref.current = value;
	}, [value]);

	return ref;
};

export default useLatest;
