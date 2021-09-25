import { clsx } from "@littlethings/css";
import {
	cloneElement,
	ComponentChild,
	FunctionComponent,
	isValidElement,
} from "preact";
import {
	Ref,
	useImperativeHandle,
	useState,
	useCallback,
	useEffect,
	useRef,
} from "preact/hooks";
import useCSS from "../../hooks/useCSS";
import useLatest from "../../hooks/useLatest";
import { AnyFunction } from "../../types/fn";
import TransitionGroup from "../TransitionGroup";
import RippleDot, { RippleDotProps } from "./RippleDot";

const DEFAULT_BOUNDING_RECT = {
	width: 0,
	height: 0,
	left: 0,
	top: 0,
};

const ANIMATION_DURATION = 350;

export type RippleEvent = MouseEvent | TouchEvent | KeyboardEvent;

export interface RippleEventOptions {
	center: boolean;
}

export interface RippleHandle {
	start: (
		event: RippleEvent,
		options?: RippleEventOptions,
		callback?: AnyFunction
	) => void;
	stop: (event: RippleEvent, callback?: AnyFunction) => void;
}

export interface RippleProps {
	handle: Ref<RippleHandle | null>;
	center?: boolean;
	color?: string;
	classes?: {
		root?: string;
		dot?: string;
	};
}

const isMouseEvent = (event: any): event is MouseEvent =>
	event && event instanceof MouseEvent;

const isTouchEvent = (event: any): event is TouchEvent =>
	event && event.hasOwnProperty("touches");

const isKeyboardEvent = (event: any): event is KeyboardEvent =>
	event && event instanceof KeyboardEvent;

interface StartCommitOptions {
	props: RippleDotProps;
	callback?: Function;
}

const Ripple: FunctionComponent<RippleProps> = ({
	handle: ref,
	center = false,
	color,
	...props
}) => {
	const rootRef = useRef<HTMLSpanElement>(null);
	const [ripples, setRipples] = useState<Array<ComponentChild>>([]);
	const ripplesRef = useLatest(ripples);
	const rippleKeyRef = useRef(0);
	const rippleCallback = useRef<Function | null>(null);
	const startTimerCommit = useRef<Function | null>(null);
	const startTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	console.log("render", ripples);

	useEffect(() => {
		console.log("rippleCallback()", rippleCallback.current);
		rippleCallback.current?.();
		rippleCallback.current = null;
	}, [ripples]);

	const startCommit = useCallback(
		({ props, callback }: StartCommitOptions) => {
			console.log("startCommit()");
			console.log("startCommit: setRipples()");
			setRipples((prevRipples) => {
				const ripples = [
					...prevRipples,
					<RippleDot
						{...props}
						key={rippleKeyRef.current}
						duration={ANIMATION_DURATION}
						color={color}
					/>,
				];

				console.log({ prevRipples, ripples });

				return ripples;
			});

			rippleKeyRef.current += 1;
			rippleCallback.current = callback ?? null;
		},
		[props.classes]
	);

	const start = useCallback(
		(
			event: RippleEvent,
			options: RippleEventOptions = { center: false },
			callback?: AnyFunction
		) => {
			console.log("start()");
			const isTouch = isTouchEvent(event);
			const isMouse = isMouseEvent(event);
			const isKeyboard = isKeyboardEvent(event);

			const bounds =
				rootRef.current?.getBoundingClientRect() ??
				DEFAULT_BOUNDING_RECT;

			const props = {
				x: 0,
				y: 0,
				size: 0,
			} as RippleDotProps;

			if (
				center ||
				options.center ||
				isKeyboard ||
				(isMouse && event.clientX === 0 && event.clientY === 0)
			) {
				props.x = Math.round(bounds.width / 2);
				props.y = Math.round(bounds.height / 2);
			} else {
				const { clientX, clientY } = isTouch ? event.touches[0] : event;

				props.x = Math.round(clientX - bounds.left);
				props.y = Math.round(clientY - bounds.top);
			}

			if (center) {
				props.size = Math.sqrt(
					(2 * bounds.width ** 2 + bounds.height ** 2) / 3
				);

				if (!(props.size & 1)) {
					props.size += 1;
				}
			} else {
				// prettier-ignore
				const width =
				Math.max(
					Math.abs((rootRef.current?.clientWidth ?? 0) - props.x),
					props.x
				) * 2 + 2;

				// prettier-ignore
				const height =
				Math.max(
					Math.abs((rootRef.current?.clientHeight ?? 0) - props.y),
					props.y
				) * 2 + 2;

				props.size = Math.sqrt(width ** 2 + height ** 2);
			}

			if (isTouch) {
				if (startTimerCommit.current === null) {
					startTimerCommit.current = () => {
						startCommit({ props, callback: callback });
					};

					startTimer.current = setTimeout(() => {
						if (startTimerCommit.current) {
							startTimerCommit.current();
							startTimerCommit.current = null;
						}
					}, 80);
				}
			} else {
				startCommit({
					props,
					callback: callback,
				});
			}
		},
		[center, startCommit]
	);

	const stop = useCallback((event: RippleEvent, callback?: AnyFunction) => {
		console.log("stop()", callback);
		if (startTimer.current) {
			clearTimeout(startTimer.current);
		}

		if (event.type === "touchend" && startTimerCommit.current) {
			(event as any)?.persist();

			startTimerCommit.current();
			startTimerCommit.current = null;
			startTimer.current = setTimeout(() => {
				stop(event, callback);
			});

			return;
		}

		startTimerCommit.current = null;

		console.log("stop: setRipples()");
		setRipples((prevRipples) => {
			if (prevRipples.length > 0) {
				console.log({ prevRipples, nextRipples: prevRipples.slice(1) });
				return prevRipples.slice(1);
			} else {
				return prevRipples;
			}
		});

		if (ripplesRef.current.length === 0) {
			callback?.();
		} else {
			rippleCallback.current = callback ?? null;
		}
	}, []);

	useImperativeHandle(
		ref,
		(): RippleHandle => {
			return {
				start,
				stop,
			};
		},
		[start, stop]
	);

	const classes = useCSS(({ css }) => {
		return {
			root: css`
				position: absolute;
				overflow: hidden;

				top: 0;
				left: 0;
				right: 0;
				bottom: 0;

				z-index: 0;
				border-radius: inherit;

				pointer-events: none;
			`,
		};
	});

	return (
		<span ref={rootRef} class={clsx(classes.root, props.classes?.root)}>
			<TransitionGroup enter exit>
				{ripples}
			</TransitionGroup>
		</span>
	);
};

export default Ripple;
