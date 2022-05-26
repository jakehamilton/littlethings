import {
	cloneElement,
	ComponentChildren,
	FunctionComponent,
	isValidElement,
	toChildArray,
} from "preact";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { TransitionGroupContext } from "../../contexts/TransitionGroup";
import useAsyncState from "../../hooks/useAsyncState";
import useCancellableCallback from "../../hooks/useCancellableCallback";
import useDeferredEffect from "../../hooks/useDeferredEffect";

export enum TransitionStatus {
	ENTERING = "entering",
	ENTERED = "entered",
	EXITING = "exiting",
	EXITED = "exited",
	UNMOUNTED = "unmounted",
}

export interface TransitionChildProps {
	status?: TransitionStatus;
}

export interface TransitionProps {
	in?: boolean;

	appear?: boolean;
	enter?: boolean;
	exit?: boolean;

	mountOnEnter?: boolean;
	unmountOnExit?: boolean;

	timeout: number | { enter: number; exit: number; appear?: number };

	onEnter?: () => void;
	onEntering?: () => void;
	onEntered?: () => void;

	onExit?: () => void;
	onExiting?: () => void;
	onExited?: () => void;

	children:
		| ComponentChildren
		| ((status: TransitionStatus) => ComponentChildren);
}

const Transition: FunctionComponent<TransitionProps> = (props) => {
	// We diff the props later to see if we need to update the
	// status to match a new `in` value.
	const prevPropsRef = useRef(props);

	// Actions are delayed for animations or could be interrupted
	// when a new render happens. This system lets us cancel a
	// queued action and replace it with another.
	const [callbackRef, setCallback, cancelCallback] = useCancellableCallback();

	// What state the transition is currently in. Our only options
	// to start are "exited", "entered", and "unmounted". The
	// "unmounted" case is used when the transition mounts, but
	// has `in` set to false (meaning exit/don't show anything).
	const [status, setStatus] = useState<TransitionStatus>(() => {
		const appear = props.appear;

		if (props.in) {
			if (appear) {
				return TransitionStatus.EXITED;
			} else {
				return TransitionStatus.ENTERED;
			}
		} else {
			if (props.mountOnEnter || props.unmountOnExit) {
				return TransitionStatus.UNMOUNTED;
			} else {
				return TransitionStatus.EXITED;
			}
		}
	});

	// Users can configure timeouts in two different ways. They
	// can supply an object with individual durations for events
	// or they can use a single number for all durations. Here
	// we normalize those values to an object with durations for
	// each specific event.
	const timeouts = useMemo(() => {
		if (typeof props.timeout === "number") {
			return {
				enter: props.timeout,
				exit: props.timeout,
				appear: props.timeout,
			};
		} else {
			return {
				enter: props.timeout.enter,
				exit: props.timeout.exit,
				// Appear is a special case that the user typically doesn't
				// need to worry about. Because of this, we allow the user
				// to only specify an "enter" duration.
				appear: props.timeout.appear ?? props.timeout.enter,
			};
		}
	}, [props.timeout]);

	// This is a convenience wrapper around updating state and
	// also setting the callback to execute on the next render.
	const setStatusWithEffect = (
		status: TransitionStatus,
		effect: () => void
	) => {
		setCallback(effect);
		setStatus(status);
	};

	// This is a convenience wrapper around setting a
	// cancellable timeout. This way we don't hit any weird
	// race conditions or issues when unmounting.
	const delay = (handler: () => void, timeout: number) => {
		const callback = setCallback(handler);

		setTimeout(callback, timeout);
	};

	// This is called when we are "entering". There is a special
	// case for when we're mounting this component, which uses
	// the "appear" duration rather than the "enter" duration.
	const doEnter = (isMounting: boolean) => {
		const isAppearing = isMounting;

		const timeout = isAppearing ? timeouts.appear : timeouts.enter;

		if (!isMounting && !props.enter) {
			setStatusWithEffect(TransitionStatus.ENTERED, () => {
				props.onEntered?.();
			});
		} else {
			props.onEnter?.();

			setStatusWithEffect(TransitionStatus.ENTERING, () => {
				props.onEntering?.();

				delay(() => {
					setStatusWithEffect(TransitionStatus.ENTERED, () => {
						props.onEntered?.();
					});
				}, timeout);
			});
		}
	};

	// This is called when we are "exiting".
	const doExit = () => {
		if (!props.exit) {
			setStatusWithEffect(TransitionStatus.EXITED, () => {
				props.onExited?.();
			});

			return;
		}

		props.onExit?.();

		setStatusWithEffect(TransitionStatus.EXITING, () => {
			props.onExiting?.();

			delay(() => {
				setStatusWithEffect(TransitionStatus.EXITED, () => {
					props.onExited?.();
				});
			}, timeouts.exit);
		});
	};

	// This is called once each render and will dispatch our
	// "doEnter" and "doExit" functions depending on the current
	// status of the transition. This function also sets the
	// status to "unmounted" if the user has configured
	// "unmountOnExit".
	const updateStatus = (
		isMounting: boolean,
		nextStatus: TransitionStatus | null
	) => {
		if (nextStatus !== null) {
			cancelCallback();

			if (nextStatus === TransitionStatus.ENTERING) {
				doEnter(isMounting);
			} else {
				doExit();
			}
		} else if (props.unmountOnExit && status === TransitionStatus.EXITED) {
			setStatus(TransitionStatus.UNMOUNTED);
		}
	};

	// When a previously unmounted transition is set to display
	// again (`in=true`), we update the status to instead be "exited"
	// in order to mount the child node again and prepare for the
	// following transition.
	useDeferredEffect(() => {
		if (props.in && status === TransitionStatus.UNMOUNTED) {
			setStatus(TransitionStatus.EXITED);
		}
	}, [props.in]);

	// When we mount, `updateStatus` is called to allow "appear"
	// effects to happen.
	useEffect(() => {
		const appear = props.appear;

		updateStatus(
			true,
			props.in && appear ? TransitionStatus.ENTERING : null
		);
	}, []);

	// This is the operation for each render. Here we diff
	// the props from the previous ones and decide on the
	// next status of the transition if there is one. Then,
	// we call `updateStatus` to make the new status a
	// reality.
	useEffect(() => {
		const prevProps = prevPropsRef.current;
		prevPropsRef.current = props;

		let nextStatus: TransitionStatus | null = null;

		if (props !== prevProps) {
			if (props.in) {
				if (
					status !== TransitionStatus.ENTERING &&
					status !== TransitionStatus.ENTERED
				) {
					nextStatus = TransitionStatus.ENTERING;
				}
			} else {
				if (
					status === TransitionStatus.ENTERING ||
					status === TransitionStatus.ENTERED
				) {
					nextStatus = TransitionStatus.EXITING;
				}
			}
		}

		updateStatus(false, nextStatus);
	});

	// Then, whenever the status changes we need to execute
	// the accompanying callback if there was one.
	useEffect(() => {
		callbackRef?.current?.();
	}, [status]);

	if (status === TransitionStatus.UNMOUNTED) {
		return null;
	}

	return (
		<TransitionGroupContext.Provider value={{ isMounting: false }}>
			{typeof props.children === "function"
				? props.children(status)
				: toChildArray(props.children).map((child) =>
						isValidElement(child)
							? cloneElement(child, { status })
							: child
				  )}
		</TransitionGroupContext.Provider>
	);
};

export default Transition;
