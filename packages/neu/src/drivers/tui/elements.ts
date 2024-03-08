import { Source } from "~/streams/interface";
import { Border, Color } from "./render";

export enum VNodeType {
	Root = "root",
	Box = "box",
	Text = "text",
}

export interface VNodeElementStyle {
	color?: Color | Source<Color>;
	background?: Color | Source<Color>;
	width?: number | "auto" | Source<number | "auto">;
	height?: number | "auto" | Source<number | "auto">;
	overflow?:
		| "hidden"
		| "visible"
		| "scroll"
		| Source<"hidden" | "visible" | "scroll">;
	flexDirection?: "row" | "column" | Source<"row" | "column">;
	alignSelf?:
		| "auto"
		| "flex-start"
		| "center"
		| "flex-end"
		| "stretch"
		| "baseline"
		| "space-between"
		| "space-around"
		| Source<
				| "auto"
				| "flex-start"
				| "center"
				| "flex-end"
				| "stretch"
				| "baseline"
				| "space-between"
				| "space-around"
		  >;
	alignContent?:
		| "auto"
		| "flex-start"
		| "center"
		| "flex-end"
		| "stretch"
		| "baseline"
		| "space-between"
		| "space-around"
		| Source<
				| "auto"
				| "flex-start"
				| "center"
				| "flex-end"
				| "stretch"
				| "baseline"
				| "space-between"
				| "space-around"
		  >;
	justifyContent?:
		| "flex-start"
		| "center"
		| "flex-end"
		| "space-evenly"
		| "space-between"
		| "space-around"
		| Source<
				| "flex-start"
				| "center"
				| "flex-end"
				| "space-evenly"
				| "space-between"
				| "space-around"
		  >;
	display?: "none" | "flex" | Source<"none" | "flex">;
	position?: "relative" | "absolute" | Source<"relative" | "absolute">;
	top?: number | `${number}%` | Source<number | `${number}%`>;
	left?: number | `${number}%` | Source<number | `${number}%`>;
	right?: number | `${number}%` | Source<number | `${number}%`>;
	bottom?: number | `${number}%` | Source<number | `${number}%`>;
	margin?: number | Source<number>;
	marginTop?: number | Source<number>;
	marginLeft?: number | Source<number>;
	marginRight?: number | Source<number>;
	marginBottom?: number | Source<number>;
	padding?: number | Source<number>;
	paddingTop?: number | Source<number>;
	paddingLeft?: number | Source<number>;
	paddingRight?: number | Source<number>;
	paddingBottom?: number | Source<number>;
	border?: Border | Source<Border>;
	[key: string]: any;
}

export interface VNodeElementProps extends VNodeElementStyle {
	style?: VNodeElementStyle | Source<VNodeElementStyle>;
	[key: string]: any;
}

export type VNodeChildren =
	| Array<VNode | VNodeStream | { tui: VNodeStream }>
	| VNodeStream
	| VNode;

export type VNodeElement = {
	type: VNodeType;
	props?: VNodeElementProps;
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

export function node(type: VNodeType): VNodeElement;
export function node(type: VNodeType, props: VNodeElementProps): VNodeElement;
export function node(type: VNodeType, children: VNodeChildren): VNodeElement;
export function node(
	type: VNodeType,
	props: VNodeElementProps,
	children: VNodeChildren,
): VNodeElement;
export function node(
	type: VNodeType,
	props?: VNodeElementProps | VNodeChildren,
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
	(type: VNodeType) =>
	(props?: VNodeElementProps | VNodeChildren, children?: VNodeChildren) =>
		// @ts-ignore
		node(type, props, children);

export const box = _node(VNodeType.Box);
export const text = (
	props?: VNodeElementProps | VNodeChildren,
	children?: VNodeChildren,
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
