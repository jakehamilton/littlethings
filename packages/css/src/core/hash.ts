import { CSSDefinitions } from "../types/css";
import stringify from "../util/stringify";
import astish from "./astish";
import parse from "./parse";
import { Sheet } from "./sheet";
import toHash from "./toHash";
import { update } from "./update";

export const cache = new Map<string, string>();

const hash = (
	compiled: string | CSSDefinitions,
	sheet: Sheet,
	global?: boolean,
	append?: boolean,
	keyframes?: boolean
): string => {
	const stringified =
		typeof compiled === "object" ? stringify(compiled) : compiled;

	if (!cache.has(stringified)) {
		cache.set(stringified, toHash(stringified));
	}

	const className = cache.get(stringified)!;

	if (!cache.has(className)) {
		const ast = typeof compiled === "object" ? compiled : astish(compiled);

		const parsed = parse(
			keyframes ? { ["@keyframes " + className]: ast } : ast,
			global ? "" : "." + className
		);

		cache.set(className, parsed);
	}

	update(cache.get(className)!, sheet, append);

	return className;
};

export default hash;
