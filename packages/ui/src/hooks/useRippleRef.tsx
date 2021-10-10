import { useRef } from "preact/hooks";
import { RippleHandle } from "../components/Ripple";

const useRippleRef = () => {
	const ref = useRef<RippleHandle>(null);

	return ref;
};

export default useRippleRef;
