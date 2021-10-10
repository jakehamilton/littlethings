import { clsx } from "@littlethings/css";
import { ComponentChild, FunctionComponent } from "preact";
import {
	useRef,
	useEffect,
	Ref,
	useState,
	useCallback,
	useImperativeHandle,
} from "preact/hooks";
import useLatest from "../../hooks/useLatest";
import { isKeyboardEvent, isMouseEvent, isTouchEvent } from "../../util/events";
import TransitionGroup, { TransitionGroupProps } from "../TransitionGroup";
import RippleDot, { RippleDotProps } from "./RippleDot";
import useRippleStyles from "./useRippleStyles";

/**
 * How long it takes for the ripple to grow (and fade).
 */
const DEFAULT_DURATION = 350;

/**
 * The default bounding rectangle to use when trying to size the containing area.
 */
const DEFAULT_BOUNDING_RECT = {
	width: 0,
	height: 0,
	top: 0,
	bottom: 0,
	left: 0,
	right: 0,
} as const;

/**
 * A ripple can be triggered with the mouse, touch, or keyboard.
 */
export type RippleEvent = MouseEvent | TouchEvent | KeyboardEvent;

export interface AddOptions {
	center: boolean;
}

const DEFAULT_ADD_OPTIONS: AddOptions = {
	center: false,
};

export type RippleCallback = () => void;

export interface RippleHandle {
	/**
	 * Add a ripple.
	 */
	add: (
		event: RippleEvent,
		options?: AddOptions,
		callback?: RippleCallback
	) => void;

	/**
	 * Remove a ripple.
	 */
	remove: (event: RippleEvent, callback?: RippleCallback) => void;
}

interface RippleSizing {
	x: number;
	y: number;
	size: number;
}

interface addNewRippleOptions {
	sizing: RippleSizing;
	callback?: RippleCallback;
}

export interface RippleClasses {
	root?: string;
}

export interface RippleProps {
	handleRef: Ref<RippleHandle | null>;
	center?: boolean;
	color?: string;
	duration?: number;
	classes?: RippleClasses;
	RippleDotProps?: Partial<RippleDotProps>;
	TransitionGroupProps?: Partial<TransitionGroupProps>;
}

const Ripple: FunctionComponent<RippleProps> = ({
	center = false,
	duration = DEFAULT_DURATION,
	color,
	handleRef,
	RippleDotProps,
	TransitionGroupProps,
	...props
}) => {
	const classes = useRippleStyles();

	// The root element is used for size and position measurements
	const rootElementRef = useRef<HTMLSpanElement>(null);

	// All of the ripples to render
	const [ripples, setRipples] = useState<Array<ComponentChild>>([]);
	// The latest ripples are also saved on a ref for async use
	const latestRipplesRef = useLatest(ripples);

	// Ripples must be rendered with a unique key, so we store that here
	const rippleKeyRef = useRef(0);
	// After a ripple is rendered or removed, a callback may be fired
	const rippleCallback = useRef<() => void>(null);

	// Some events require delaying updates, so we hold a separate,
	// delayed callback.
	const delayedUpdateRipplesCallback = useRef<() => void>(null);
	// The timeout used to call the delayed update callback is also saved.
	const delayedUpdateRipplesTimeout = useRef<ReturnType<typeof setTimeout>>(
		null
	);

	useEffect(() => {
		// When `ripples` update, fire any saved callback for the last action.
		rippleCallback.current?.();
		rippleCallback.current = null;
	}, [ripples]);

	const addNewRipple = useCallback(
		({ sizing, callback }: addNewRippleOptions) => {
			setRipples((prevRipples) => {
				const newRipples = [
					...prevRipples,
					// @ts-expect-error
					// We're partially rendering this because TransitionGroup clones
					// the element with more props.
					<RippleDot
						{...sizing}
						duration={DEFAULT_DURATION}
						color={color}
						{...RippleDotProps}
						key={rippleKeyRef.current}
					/>,
				];

				return newRipples;
			});

			rippleKeyRef.current += 1;
			rippleCallback.current = callback ?? null;
		},
		[RippleDotProps]
	);

	const add: RippleHandle["add"] = useCallback(
		(event, options = DEFAULT_ADD_OPTIONS, callback) => {
			const isTouch = isTouchEvent(event);
			const isMouse = isMouseEvent(event);
			const isKeyboard = isKeyboardEvent(event);

			const bounds =
				rootElementRef.current?.getBoundingClientRect() ??
				DEFAULT_BOUNDING_RECT;

			const sizing: RippleSizing = {
				x: 0,
				y: 0,
				size: 0,
			};

			if (
				center ||
				options.center ||
				isKeyboard ||
				(isMouse && event.clientX === 0 && event.clientY === 0)
			) {
				sizing.x = Math.round(bounds.width / 2);
				sizing.y = Math.round(bounds.height / 2);
			} else {
				const { clientX, clientY } = isTouch ? event.touches[0] : event;

				sizing.x = Math.round(clientX - bounds.left);
				sizing.y = Math.round(clientY - bounds.top);
			}

			if (center || options.center) {
				sizing.size = Math.sqrt(
					(2 * bounds.width ** 2 + bounds.height ** 2) / 3
				);

				if (!(sizing.size & 1)) {
					sizing.size += 1;
				}
			} else {
				// prettier-ignore
				const width =
				Math.max(
					Math.abs((rootElementRef.current?.clientWidth ?? 0) - sizing.x),
					sizing.x
				) * 2 + 2;

				// prettier-ignore
				const height =
				Math.max(
					Math.abs((rootElementRef.current?.clientHeight ?? 0) - sizing.y),
					sizing.y
				) * 2 + 2;

				sizing.size = Math.sqrt(width ** 2 + height ** 2);
			}

			if (isTouch) {
				if (delayedUpdateRipplesCallback.current === null) {
					delayedUpdateRipplesCallback.current = () => {
						addNewRipple({ sizing, callback });
					};

					delayedUpdateRipplesTimeout.current = setTimeout(() => {
						delayedUpdateRipplesCallback.current?.();
						delayedUpdateRipplesCallback.current = null;
					}, 80);
				}
			} else {
				addNewRipple({
					sizing,
					callback,
				});
			}
		},
		[center, addNewRipple]
	);

	const remove: RippleHandle["remove"] = useCallback((event, callback) => {
		if (delayedUpdateRipplesTimeout.current) {
			clearTimeout(delayedUpdateRipplesTimeout.current);
		}

		if (event.type === "touchend" && delayedUpdateRipplesCallback.current) {
			(event as any).persist();

			delayedUpdateRipplesCallback.current?.();
			delayedUpdateRipplesCallback.current = null;

			delayedUpdateRipplesTimeout.current = setTimeout(() => {
				remove(event, callback);
			});

			return;
		}

		delayedUpdateRipplesCallback.current = null;

		setRipples((prevRipples) => {
			if (prevRipples.length > 0) {
				console.count("Remove Ripple");
				const newRipples = prevRipples.slice(1);

				console.log([...newRipples]);

				return newRipples;
			} else {
				return prevRipples;
			}
		});

		if (latestRipplesRef.current.length === 0) {
			callback?.();
		} else {
			rippleCallback.current = callback ?? null;
		}
	}, []);

	useImperativeHandle(
		handleRef,
		(): RippleHandle => {
			return {
				add,
				remove,
			};
		}
	);

	return (
		<span
			ref={rootElementRef}
			class={clsx(classes.root, props.classes?.root)}
		>
			<TransitionGroup enter exit {...TransitionGroupProps}>
				{ripples}
			</TransitionGroup>
		</span>
	);
};

export default Ripple;
