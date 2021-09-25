import { EffectCallback, Inputs, useEffect } from "preact/hooks";

let useUniversalEffect = useEffect;

if (typeof window === "undefined") {
	useUniversalEffect = (effect: EffectCallback, inputs?: Inputs) => {
		const cleanup = effect();

		cleanup?.();
	};
}

export default useUniversalEffect;
