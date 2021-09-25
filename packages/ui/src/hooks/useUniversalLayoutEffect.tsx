import { useLayoutEffect } from "preact/hooks";
import useUniversalEffect from "./useUniversalEffect";

const useUniversalLayoutEffect =
	typeof window === "undefined" ? useUniversalEffect : useLayoutEffect;

export default useUniversalLayoutEffect;
