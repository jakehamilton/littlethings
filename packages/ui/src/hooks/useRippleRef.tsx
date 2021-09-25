import { useRef } from "preact/hooks";
import { RippleHandle } from "../components/Ripple/index.old";

const useRippleRef = () => {
	const ref = useRef<RippleHandle>(null);

	return ref;
};

export default useRippleRef;
