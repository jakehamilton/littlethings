export const DEFAULT_SHEET_ID = "_css" as const;

export interface SSRSheet {
	data: string;
}

export type Sheet = Text | SSRSheet;

const ssr: SSRSheet = {
	data: "",
};

const getElement = (target?: Element): Element | null | undefined => {
	const element = target
		? target.querySelector("#" + DEFAULT_SHEET_ID)
		: window[DEFAULT_SHEET_ID];

	return element;
};

const createStyleNode = (target?: Element) => {
	const parent = target ?? document.head;

	const style = document.createElement("style");

	style.id = DEFAULT_SHEET_ID;
	style.innerHTML = " ";

	parent.appendChild(style);

	return style;
};

const TEXT_NODE_TYPE = 3;

const isTextNode = (node: Node): node is Text =>
	node.nodeType === TEXT_NODE_TYPE;

export const getSheet = (target?: Element | Text): Sheet => {
	if (target && isTextNode(target)) {
		return target;
	}

	if (typeof window === "object") {
		const sheet = getElement(target) ?? createStyleNode(target);

		const child = sheet.firstChild;

		if (!child || !isTextNode(child)) {
			throw new Error("Target element must have a text node child.");
		}

		return child;
	}

	return ssr;
};
