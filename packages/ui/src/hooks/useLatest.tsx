import { useRef, Ref } from "preact/hooks";

const useLatest = <Value extends unknown>(value: Value): Ref<Value> => {
	const ref = useRef(value);

	ref.current = value;

	return ref;
};

export default useLatest;
