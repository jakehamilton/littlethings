import { FunctionComponent, VNode } from "preact";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { TransitionGroupContext } from "../../contexts/TransitionGroup";
import useDeferredEffect from "../../hooks/useDeferredEffect";
import useLatest from "../../hooks/useLatest";
import {
	ChildMapping,
	getChildMapping,
	getInitialChildMapping,
	getNextChildMapping,
	TransitionGroupChild,
	TransitionGroupParentProps,
} from "./util";

export interface TransitionGroupProps {
	appear?: boolean;
	enter?: boolean;
	exit?: boolean;
}

const TransitionGroup: FunctionComponent<TransitionGroupProps> = (props) => {
	const propsRef = useLatest(props);
	const isMountedRef = useRef(true);
	const [isMounting, setIsMounting] = useState(true);

	const handleExit = useCallback((child: TransitionGroupChild) => {
		const currentChildMapping = getChildMapping(propsRef.current.children);

		if (child.key in currentChildMapping) {
			return;
		}

		child.props.onExited?.(child);

		if (isMountedRef.current) {
			setChildMapping((prevChildMapping) => {
				const childMapping = { ...prevChildMapping };

				delete childMapping[child.key];

				return childMapping;
			});
		}
	}, []);

	const [childMapping, setChildMapping] = useState<ChildMapping>(() => {
		return getInitialChildMapping(
			props as TransitionGroupParentProps,
			handleExit
		);
	});

	useEffect(() => {
		setIsMounting(false);

		return () => {
			isMountedRef.current = false;
		};
	}, []);

	useDeferredEffect(() => {
		setChildMapping(
			getNextChildMapping(
				props as TransitionGroupParentProps,
				childMapping,
				handleExit
			)
		);
	}, [props]);

	const children = Object.values(childMapping);

	return (
		<TransitionGroupContext.Provider value={{ isMounting }}>
			{children}
		</TransitionGroupContext.Provider>
	);
};

export default TransitionGroup;
