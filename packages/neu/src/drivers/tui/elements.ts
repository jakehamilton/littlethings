import { Source } from "~/streams/interface";

export type VNodeChildren =
	| Array<VNode | VNodeStream | { tui: VNodeStream }>
	| VNodeStream
	| VNode;

export type VNodeElement = {
	type: string;
	props?: Record<string, any>;
	children?: VNodeChildren;
};

export type VNodeStream = Source<VNode>;

export type VNode = string | VNodeElement | null | undefined;

export const isVNode = (value: any): value is VNode => {
	return typeof value === "string" || isVNodeElement(value);
};

export const isVNodeElement = (value: any): value is VNode => {
	return typeof value === "object" && value !== null && "type" in value;
};

export function node(type: string): VNodeElement;
export function node(type: string, props: Record<string, any>): VNodeElement;
export function node(type: string, children: VNodeChildren): VNodeElement;
export function node(
	type: string,
	props: Record<string, any>,
	children: VNodeChildren,
): VNodeElement;
export function node(
	type: string,
	props?: Record<string, any> | VNodeChildren,
	children?: VNodeChildren,
): VNodeElement {
	if (props === undefined) {
		return { type };
	}

	// Child as second argument
	if (Array.isArray(props)) {
		return { type, children: props as VNodeChildren };
	}

	if (isVNode(props)) {
		return { type, children: [props] };
	}

	if (isVNode(children)) {
		return { type, props, children: [children] };
	}

	return { type, props, children };
}

const _node =
	(type: string) =>
	(props?: Record<string, any> | VNodeChildren, children?: VNodeChildren) =>
		// @ts-ignore
		node(type, props, children);

export const box = _node("box");
export const text = (
	props?: Record<string, any> | string | Array<string>,
	children?: string | Array<string>,
) => {
	const userProps =
		typeof props === "string" || Array.isArray(props) ? {} : props;
	const userChildren =
		typeof props === "string" || Array.isArray(props) ? props : children;

	const propsWithDefault = {
		width: "auto",
		height: "auto",
		...userProps,
	};

	return box(propsWithDefault, userChildren);
};
