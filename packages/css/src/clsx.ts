import { cache } from "./core/hash";
import { getSheet } from "./core/sheet";
import toHash from "./core/toHash";
import { update } from "./core/update";

// The separator used when hashing the whole array of classnames
const HASH_NAME_SEPARATOR = "$";

// The separator used when appending a unique hash to a classname
const SCOPED_NAME_SEPARATOR = "-";

export interface ClsxContext {
	/*
	 * Whether CSS updates should be appended to existing css or not.
	 */
	append?: boolean;
	/*
	 * Target to render css to.
	 */
	target?: Element | Text;
}

function clsx(
	this: ClsxContext | void,
	...classes: Array<string | undefined | null | false>
) {
	const input: Array<string> = classes.filter(
		(className): className is string => Boolean(className)
	);

	const context = this || {};

	const id = toHash(input.join(HASH_NAME_SEPARATOR));

	let scopedClasses = "";

	for (const className of input) {
		for (const singleClass of className.split(" ")) {
			if (singleClass === "") {
				continue;
			}

			const scopedClass = singleClass + SCOPED_NAME_SEPARATOR + id;

			if (cache.has(singleClass)) {
				if (!cache.has(scopedClass)) {
					const scopedCSS = cache
						.get(singleClass)!
						.replaceAll(singleClass, scopedClass);

					cache.set(scopedClass, scopedCSS);

					update(scopedCSS, getSheet(context.target), context.append);
				}

				scopedClasses += " " + scopedClass;
			} else {
				scopedClasses += " " + singleClass;
			}
		}
	}

	return scopedClasses;
}

export { clsx };
