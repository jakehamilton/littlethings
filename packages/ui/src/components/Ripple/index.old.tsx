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
import RippleDot, { RippleDotProps } from "./RippleDot";

const DEFAULT_BOUNDING_RECT = {
	width: 0,
	height: 0,
	left: 0,
	top: 0,
};

const ANIMATION_DURATION = 350;

export type RippleEvent = MouseEvent | TouchEvent | KeyboardEvent;

export interface RippleHandle {
	start: (event: RippleEvent, options: object, cb: Function) => void;
	stop: (event: RippleEvent, cb: Function) => void;
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
	cb: Function;
}

const Ripple: FunctionComponent<RippleProps> = ({
	handle: ref,
	center = false,
	color,
	...props
}) => {
	const rootRef = useRef<HTMLSpanElement>(null);
	const [ripples, setRipples] = useState<Array<ComponentChild>>([]);
	const rippleKeyRef = useRef(0);
	const rippleCallback = useRef<Function | null>(null);
	const startTimerCommit = useRef<Function | null>(null);
	const startTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		rippleCallback.current?.();
		rippleCallback.current = null;
	}, [ripples]);

	const startCommit = useCallback(
		({ props, cb }: StartCommitOptions) => {
			setRipples((prevRipples) => [
				...prevRipples,
				<RippleDot
					{...props}
					key={rippleKeyRef.current}
					duration={ANIMATION_DURATION}
					exit={false}
					color={color}
				/>,
			]);

			rippleKeyRef.current += 1;
			rippleCallback.current = cb;
		},
		[props.classes]
	);

	const start = useCallback(
		(event: RippleEvent, options = {}, cb: Function) => {
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
						startCommit({ props, cb });
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
					cb,
				});
			}
		},
		[center, startCommit]
	);

	const stop = useCallback((event: RippleEvent, cb: Function) => {
		if (startTimer.current) {
			clearTimeout(startTimer.current);
		}

		if (event.type === "touchend" && startTimerCommit.current) {
			(event as any)?.persist();

			startTimerCommit.current();
			startTimerCommit.current = null;
			startTimer.current = setTimeout(() => {
				stop(event, cb);
			});

			return;
		}

		// setRipples(([firstRipple, ...otherRipples]) => {
		// 	if (firstRipple) {
		// 		return [
		// 			isValidElement(firstRipple)
		// 				? cloneElement(firstRipple, {
		// 						exit: true,
		// 				  })
		// 				: firstRipple,
		// 			...otherRipples,
		// 		];
		// 	}

		// 	return otherRipples;
		// });

		// setTimeout(() => {
		startTimerCommit.current = null;

		setRipples((prevRipples) => {
			if (prevRipples.length > 0) {
				return prevRipples.slice(1);
			}

			return prevRipples;
		});

		rippleCallback.current = cb;
		// }, ANIMATION_DURATION + 25);
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
			{ripples}
		</span>
	);
};

export default Ripple;
