import {
	toChildArray,
	cloneElement,
	ComponentChildren,
	VNode,
	isValidElement,
} from "preact";

const id = <T extends unknown>(x: T) => x;

export interface TransitionGroupParentProps {
	appear?: boolean;
	enter?: boolean;
	exit?: boolean;
	children: ComponentChildren;
}

export interface TransitionGroupChildProps {
	in?: boolean;
	appear?: boolean;
	enter?: boolean;
	exit?: boolean;
	onExited: (child: VNode<TransitionGroupChildProps>) => void;
}

export type TransitionGroupChild = VNode<TransitionGroupChildProps>;

export type ChildMapping = Record<VNode["key"], TransitionGroupChild>;

const getProp = <
	Child extends TransitionGroupChild,
	Props extends TransitionGroupParentProps,
	Prop extends keyof TransitionGroupParentProps
>(
	child: Child,
	prop: Prop,
	props: Props
): [Props[Prop]] extends [undefined] ? Child["props"][Prop] : Props[Prop] => {
	// @ts-expect-error
	return props[prop] === undefined ? child.props[prop] : props[prop];
};

export const getChildMapping = (
	children: ComponentChildren,
	mapper: (child: TransitionGroupChild) => TransitionGroupChild = id
) => {
	const mapping: ChildMapping = {};

	for (const child of toChildArray(children)) {
		if (typeof child === "string" || typeof child === "number") {
			continue;
		}

		mapping[child.key] = mapper(child as TransitionGroupChild);
	}

	return mapping;
};

export const getInitialChildMapping = (
	props: TransitionGroupParentProps,
	onExited: TransitionGroupChildProps["onExited"]
) => {
	return getChildMapping(props.children, (child) => {
		return cloneElement(child, {
			in: true,
			appear: getProp(child, "appear", props),
			enter: getProp(child, "enter", props),
			exit: getProp(child, "exit", props),
			onExited: onExited.bind(null, child),
		});
	});
};

export const mergeChildMappings = (
	prev: ChildMapping = {},
	next: ChildMapping = {}
): ChildMapping => {
	const getValueForKey = (key: VNode["key"]) => {
		return key in next ? next[key] : prev[key];
	};

	const nextKeysPending: Record<VNode["key"], Array<VNode["key"]>> = {};

	let pendingKeys: Array<VNode["key"]> = [];
	for (const prevKey in prev) {
		if (prevKey in next) {
			if (pendingKeys.length > 0) {
				nextKeysPending[prevKey] = pendingKeys;
				pendingKeys = [];
			}
		} else {
			pendingKeys.push(prevKey);
		}
	}

	const childMapping: ChildMapping = {};

	for (const nextKey in next) {
		if (nextKeysPending[nextKey]) {
			for (const pendingNextKey of nextKeysPending[nextKey]) {
				childMapping[pendingNextKey] = getValueForKey(pendingNextKey);
			}
		}

		childMapping[nextKey] = getValueForKey(nextKey);
	}

	for (const pendingKey of pendingKeys) {
		childMapping[pendingKey] = getValueForKey(pendingKey);
	}

	return childMapping;
};

export const getNextChildMapping = (
	nextProps: TransitionGroupParentProps & { children: ComponentChildren },
	prevChildMapping: ChildMapping,
	onExited: TransitionGroupChildProps["onExited"]
) => {
	const nextChildMapping = getChildMapping(nextProps.children);
	const childMapping = mergeChildMappings(prevChildMapping, nextChildMapping);

	for (const key in childMapping) {
		const child = childMapping[key];

		if (!isValidElement(child)) {
			continue;
		}

		const isInPrev = key in prevChildMapping;
		const isInNext = key in nextChildMapping;

		const prevChild = prevChildMapping[key];
		const isLeaving = isValidElement(prevChild) && !prevChild.props.in;

		if (isInNext && (!isInPrev || isLeaving)) {
			// @ts-expect-error
			childMapping[key] = cloneElement(child, {
				in: true,
				enter: getProp(child, "enter", nextProps),
				exit: getProp(child, "exit", nextProps),
				onExited: onExited.bind(null, child),
			});
		} else if (!isInNext && isInPrev && !isLeaving) {
			// @ts-expect-error
			childMapping[key] = cloneElement(child, {
				in: false,
			});
		} else if (isInNext && isInPrev && isValidElement(prevChild)) {
			// @ts-expect-error
			childMapping[key] = cloneElement(child, {
				in: prevChild.props.in,
				enter: getProp(child, "enter", nextProps),
				exit: getProp(child, "exit", nextProps),
				onExited: onExited.bind(null, child),
			});
		}
	}

	return childMapping;
};
