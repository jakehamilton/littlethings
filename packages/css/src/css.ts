import compile from "./core/compile";
import hash from "./core/hash";
import { getSheet } from "./core/sheet";
import { CSSDefinitions } from "./types/css";

export interface CSSContext {
	/*
	 * Whether or not the css is global.
	 */
	global?: boolean;
	/*
	 * Used when creating keyframes.
	 */
	keyframes?: any;
	/*
	 * Whether CSS updates should be appended to existing css or not.
	 */
	append?: any;
	/*
	 * Target to render css to.
	 */
	target?: Element | Text;
}

const isTemplateStringsArray = (x: any): x is TemplateStringsArray =>
	Array.isArray(x) && Boolean((x as any).raw);

function css(
	this: CSSContext | void,
	definitionsOrStrings: CSSDefinitions | TemplateStringsArray,
	...data: Array<any>
): string {
	const context: CSSContext = this || {};

	const compiled: string | CSSDefinitions = isTemplateStringsArray(
		definitionsOrStrings
	)
		? compile(definitionsOrStrings, data)
		: definitionsOrStrings;

	const sheet = getSheet(context.target);

	const className = hash(
		compiled,
		sheet,
		context.global,
		context.append,
		context.keyframes
	);

	return className;
}

const glob = css.bind({ global: true });

const keyframes = css.bind({ keyframes: true });

export { css, glob, keyframes };
