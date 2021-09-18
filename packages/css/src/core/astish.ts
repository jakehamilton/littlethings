/**
 * First capture group: Property name
 * Second capture group: Property value
 * Third capture group: Nested selector
 * Fourth capture group: End of block (the closing curly brace)
 */
const newRule =
	/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(})/g;

const ruleClean = /\/\*[^]*?\*\/|\s\s+|\n/g;

export interface ASTRegexBlock extends RegExpExecArray {
	/**
	 * Property name
	 */
	"1": string;
	/**
	 * Property value
	 */
	"2": string;
	/**
	 * Nested selector
	 */
	"3": string;
	/**
	 * Block end (closing curly brace)
	 */
	"4": string;
}

export interface ASTScope {
	[key: string]: string | ASTScope;
}

const astish = (css: string) => {
	let tree: Array<ASTScope> = [{}];
	let block: ASTRegexBlock | null;

	while (
		(block = newRule.exec(css.replace(ruleClean, "")) as ASTRegexBlock)
	) {
		// When block[4] exists, we're at the end of a block
		if (block[4]) {
			// Remove the current scope, leaving us with the parent one
			tree.shift();
		}

		if (block[3]) {
			// When block[3] exists, we have a new selector and block

			// Create a new scope (or use an existing one of the same name)
			let scope = (tree[0][block[3]] as ASTScope) || {};

			// Set the new scope on the current one
			tree[0][block[3]] = scope;

			// Put the new scope at the beginning of the tree array
			tree.unshift(scope);
		} else if (!block[4]) {
			// Otherwise, if we're not at the end of the block,
			// assign property name and value to the current scope
			tree[0][block[1]] = block[2];
		}
	}

	return tree[0];
};

export default astish;
