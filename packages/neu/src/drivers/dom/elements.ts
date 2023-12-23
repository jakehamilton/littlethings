import { Source } from "~/streams/interface";

export type VNodeChildren =
	| Array<VNode | VNodeStream | { dom: VNodeStream }>
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

export const a = _node("a");
export const abbr = _node("abbr");
export const address = _node("address");
export const area = _node("area");
export const article = _node("article");
export const aside = _node("aside");
export const audio = _node("audio");
export const b = _node("b");
export const base = _node("base");
export const bdi = _node("bdi");
export const bdo = _node("bdo");
export const blockquote = _node("blockquote");
export const body = _node("body");
export const br = _node("br");
export const button = _node("button");
export const canvas = _node("canvas");
export const caption = _node("caption");
export const cite = _node("cite");
export const code = _node("code");
export const col = _node("col");
export const colgroup = _node("colgroup");
export const data = _node("data");
export const datalist = _node("datalist");
export const dd = _node("dd");
export const del = _node("del");
export const details = _node("details");
export const dfn = _node("dfn");
export const dialog = _node("dialog");
export const div = _node("div");
export const dl = _node("dl");
export const dt = _node("dt");
export const em = _node("em");
export const embed = _node("embed");
export const fieldset = _node("fieldset");
export const figcaption = _node("figcaption");
export const figure = _node("figure");
export const footer = _node("footer");
export const form = _node("form");
export const h1 = _node("h1");
export const h2 = _node("h2");
export const h3 = _node("h3");
export const h4 = _node("h4");
export const h5 = _node("h5");
export const h6 = _node("h6");
export const head = _node("head");
export const header = _node("header");
export const hgroup = _node("hgroup");
export const hr = _node("hr");
export const html = _node("html");
export const i = _node("i");
export const iframe = _node("iframe");
export const img = _node("img");
export const input = _node("input");
export const ins = _node("ins");
export const kbd = _node("kbd");
export const label = _node("label");
export const legend = _node("legend");
export const li = _node("li");
export const link = _node("link");
export const main = _node("main");
export const map = _node("map");
export const mark = _node("mark");
export const meta = _node("meta");
export const meter = _node("meter");
export const nav = _node("nav");
export const noscript = _node("noscript");
export const object = _node("object");
export const ol = _node("ol");
export const optgroup = _node("optgroup");
export const option = _node("option");
export const output = _node("output");
export const p = _node("p");
export const param = _node("param");
export const picture = _node("picture");
export const pre = _node("pre");
export const progress = _node("progress");
export const q = _node("q");
export const rp = _node("rp");
export const rt = _node("rt");
export const ruby = _node("ruby");
export const s = _node("s");
export const samp = _node("samp");
export const script = _node("script");
export const section = _node("section");
export const select = _node("select");
export const slot = _node("slot");
export const small = _node("small");
export const source = _node("source");
export const span = _node("span");
export const strong = _node("strong");
export const style = _node("style");
export const sub = _node("sub");
export const summary = _node("summary");
export const sup = _node("sup");
export const table = _node("table");
export const tbody = _node("tbody");
export const td = _node("td");
export const template = _node("template");
export const textarea = _node("textarea");
export const tfoot = _node("tfoot");
export const th = _node("th");
export const thead = _node("thead");
export const time = _node("time");
export const title = _node("title");
export const tr = _node("tr");
export const track = _node("track");
export const u = _node("u");
export const ul = _node("ul");
export const var_ = _node("var");
export const video = _node("video");
export const wbr = _node("wbr");
export const webview = _node("webview");

export const svg = _node("svg");
export const animate = _node("animate");
export const animateMotion = _node("animateMotion");
export const animateTransform = _node("animateTransform");
export const circle = _node("circle");
export const clipPath = _node("clipPath");
export const defs = _node("defs");
export const desc = _node("desc");
export const ellipse = _node("ellipse");
export const feBlend = _node("feBlend");
export const feColorMatrix = _node("feColorMatrix");
export const feComponentTransfer = _node("feComponentTransfer");
export const feComposite = _node("feComposite");
export const feConvolveMatrix = _node("feConvolveMatrix");
export const feDiffuseLighting = _node("feDiffuseLighting");
export const feDisplacementMap = _node("feDisplacementMap");
export const feDistantLight = _node("feDistantLight");
export const feDropShadow = _node("feDropShadow");
export const feFlood = _node("feFlood");
export const feFuncA = _node("feFuncA");
export const feFuncB = _node("feFuncB");
export const feFuncG = _node("feFuncG");
export const feFuncR = _node("feFuncR");
export const feGaussianBlur = _node("feGaussianBlur");
export const feImage = _node("feImage");
export const feMerge = _node("feMerge");
export const feMergeNode = _node("feMergeNode");
export const feMorphology = _node("feMorphology");
export const feOffset = _node("feOffset");
export const fePointLight = _node("fePointLight");
export const feSpecularLighting = _node("feSpecularLighting");
export const feSpotLight = _node("feSpotLight");
export const feTile = _node("feTile");
export const feTurbulence = _node("feTurbulence");
export const filter = _node("filter");
export const foreignObject = _node("foreignObject");
export const g = _node("g");
export const image = _node("image");
export const line = _node("line");
export const linearGradient = _node("linearGradient");
export const marker = _node("marker");
export const mask = _node("mask");
export const metadata = _node("metadata");
export const mpath = _node("mpath");
export const path = _node("path");
export const pattern = _node("pattern");
export const polygon = _node("polygon");
export const polyline = _node("polyline");
export const radialGradient = _node("radialGradient");
export const rect = _node("rect");
export const stop = _node("stop");
export const switch_ = _node("switch");
export const symbol = _node("symbol");
export const text = _node("text");
export const textPath = _node("textPath");
export const tspan = _node("tspan");
export const use = _node("use");
export const view = _node("view");
