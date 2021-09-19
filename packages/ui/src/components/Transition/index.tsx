import { ComponentChildren } from "preact";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import useAsyncState from "../../hooks/useAsyncState";
import useDeferredEffect from "../../hooks/useDeferredEffect";
import { DynamicComponent } from "../Dynamic";

export enum TransitionStatus {
	ENTERING = "entering",
	ENTERED = "entered",
	EXITING = "exiting",
	EXITED = "exited",
	UNMOUNTED = "unmounted",
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

	children: (status: TransitionStatus) => ComponentChildren;
}

type NextCallback = {
	(...args: any[]): void;
	cancel: () => void;
};

const Transition: DynamicComponent<TransitionProps> = (props) => {
	const callbackRef = useRef<NextCallback | null>(null);
	const setCallback = <Callback extends (...args: any[]) => void>(
		callback: Callback
	) => {
		let active = true;

		const handler: NextCallback = (...args) => {
			if (active) {
				active = false;

				callbackRef.current = null;
				callback(...args);
			}
		};

		handler.cancel = () => {
			active = false;
		};

		callbackRef.current = handler;

		return handler;
	};

	const cancelCallback = () => {
		if (callbackRef.current !== null) {
			callbackRef.current.cancel();
			callbackRef.current = null;
		}
	};

	useEffect(() => {
		return () => {
			cancelCallback();
		};
	}, []);

	const initialAppearStatus = useMemo<TransitionStatus | null>(() => {
		const appear = props.appear;

		if (props.in && appear) {
			return TransitionStatus.ENTERING;
		} else {
			return null;
		}
	}, []);

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

	const safeSetStatus = (
		status: TransitionStatus,
		callback: (...args: any[]) => void
	) => {
		setCallback(callback);
		console.log(`safeSetStatus("${status}")`);
		setStatus(status);
	};

	useDeferredEffect(() => {
		if (props.in && status === TransitionStatus.UNMOUNTED) {
			setStatus(TransitionStatus.EXITED);
		}
	}, [props.in]);

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
				appear: props.timeout.appear ?? props.timeout.enter,
			};
		}
	}, [props.timeout]);

	const onTransitionEnd = (timeout: number, handler: () => void) => {
		const callback = setCallback(handler);

		setTimeout(callback, timeout);
	};

	const performEnter = (isMounting: boolean) => {
		const isAppearing = isMounting;

		const timeout = isAppearing ? timeouts.appear : timeouts.enter;

		if (!isMounting && !props.enter) {
			safeSetStatus(TransitionStatus.ENTERED, () => {
				props.onEntered?.();
			});
		} else {
			console.log("onEnter()");
			props.onEnter?.();

			safeSetStatus(TransitionStatus.ENTERING, () => {
				console.log("onEntering()");
				props.onEntering?.();

				onTransitionEnd(timeout, () => {
					console.log("`Enter` transition ended");
					safeSetStatus(TransitionStatus.ENTERED, () => {
						console.log("onEntered()");
						props.onEntered?.();
					});
				});
			});
		}
	};

	const performExit = () => {
		if (!props.exit) {
			safeSetStatus(TransitionStatus.EXITED, () => {
				props.onExited?.();
			});

			return;
		}

		props.onExit?.();

		safeSetStatus(TransitionStatus.EXITING, () => {
			props.onExiting?.();

			onTransitionEnd(timeouts.exit, () => {
				safeSetStatus(TransitionStatus.EXITED, () => {
					props.onExited?.();
				});
			});
		});
	};

	const updateStatus = (
		isMounting: boolean,
		nextStatus: TransitionStatus | null
	) => {
		if (nextStatus !== null) {
			cancelCallback();

			if (nextStatus === TransitionStatus.ENTERING) {
				performEnter(isMounting);
			} else {
				performExit();
			}
		} else if (props.unmountOnExit && status === TransitionStatus.EXITED) {
			setStatus(TransitionStatus.UNMOUNTED);
		}
	};

	useEffect(() => {
		updateStatus(true, initialAppearStatus);
	}, []);

	const prevPropsRef = useRef(props);

	useEffect(() => {
		callbackRef?.current?.();
	}, [status]);

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

	return <>{props.children(status)}</>;
};

export default Transition;
