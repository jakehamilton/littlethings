import { EffectCallback, Inputs, useEffect, useRef } from "preact/hooks";

const useDeferredEffect = (effect: EffectCallback, inputs?: Inputs) => {
	const isFirstRenderRef = useRef(true);

	useEffect(() => {
		if (isFirstRenderRef.current) {
			isFirstRenderRef.current = false;
			return;
		}

		return effect();
	}, inputs);
};

export default useDeferredEffect;
