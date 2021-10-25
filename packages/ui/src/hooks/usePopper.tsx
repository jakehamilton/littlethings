import {
	Ref,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "preact/hooks";
import {
	createPopper,
	Options,
	Modifier,
	ModifierArguments,
	Instance as Popper,
} from "@popperjs/core";
import isEqual from "react-fast-compare";
import { JSXInternal } from "preact/src/jsx";

export interface PopperOptions extends Partial<Options> {
	createPopper?: typeof createPopper;
}

export type PopperState = ModifierArguments<PopperOptions>["state"];

export type PopperStyles = PopperState["styles"];
export type PopperAttributes = PopperState["attributes"];

const NO_MODIFIERS = [] as PopperOptions["modifiers"];

const usePopper = (
	target: Ref<HTMLElement>,
	popped: Ref<HTMLElement>,
	options: PopperOptions = {}
) => {
	const {
		placement = "bottom",
		strategy = "absolute",
		modifiers = NO_MODIFIERS,
		onFirstUpdate,
	} = options;

	const popperRef = useRef<Popper>(null);
	const previousOptionsRef = useRef(options);

	const [styles, setStyles] = useState<PopperStyles>(() => {
		return {
			popper: {
				position: strategy,
				left: "0",
				top: "0",
			},
			arrow: {
				position: "absolute",
			},
		};
	});

	const [attributes, setAttributes] = useState<PopperAttributes>({});

	const modifier = useMemo(() => {
		return {
			name: "usePopper",
			phase: "write",
			enabled: true,
			requires: ["computeStyles"],
			fn({ state }) {
				const newStyles: PopperStyles = {};
				const newAttributes: PopperAttributes = {};

				for (const element of Object.keys(state.elements)) {
					if (state.styles[element]) {
						newStyles[element] = state.styles[element];
					}
					if (state.attributes[element]) {
						newAttributes[element] = state.attributes[element];
					}
				}

				setStyles(newStyles);
				setAttributes(newAttributes);
			},
		} as Modifier<"usePopper", {}>;
	}, []);

	const latestOptions = useMemo(() => {
		const currentOptions: PopperOptions = {
			placement,
			strategy,
			modifiers: [
				...modifiers!,
				modifier,
				{ name: "applyStyles", enabled: false },
			],
			onFirstUpdate,
		};

		if (isEqual(previousOptionsRef.current, currentOptions)) {
			return previousOptionsRef.current;
		} else {
			return currentOptions;
		}
	}, [placement, strategy, modifiers, onFirstUpdate]);

	useEffect(() => {
		previousOptionsRef.current = latestOptions;
		popperRef?.current?.setOptions?.(latestOptions);
	}, [latestOptions]);

	useLayoutEffect(() => {
		console.log({ target, popped });
		if (!target.current || !popped.current) {
			return;
		}

		const create = options.createPopper ?? createPopper;

		popperRef.current = create(
			target.current,
			popped.current,
			latestOptions
		);

		return () => {
			popperRef.current?.destroy();
			popperRef.current = null;
		};
	}, [target.current, popped.current, options.createPopper]);

	const fakeStyles = styles as {
		[key: string]: JSXInternal.CSSProperties;
	};

	return {
		styles: fakeStyles,
		attributes,
		popperRef,
	};
};

export default usePopper;
