import { CSSDefinitions } from "../types/css";
import block from "../util/block";
import { composeSelectors } from "../util/selector";
import kebab from "../util/kebab";

const parse = (obj: CSSDefinitions, selector: string) => {
	// CSS that comes before normal blocks/rules
	let outer = "";
	// Blocks of css
	let blocks = "";
	// Properties for the current scope
	let current = "";
	// @TODO(jakehamilton): understand how this works
	let next: string;

	// Loop through object properties
	for (let key in obj) {
		let val = obj[key];

		// When the property is an object, the key is going to be a class name (or @rule)
		if (typeof val === "object") {
			// This is already inside of another selector
			if (selector) {
				// Set `next` to be the new selector
				next = composeSelectors(selector, key);
			} else {
				// Since we don't have a parent selector, just use the key
				// which is a selector
				next = key;
			}

			// Handle @rules separately since they're special
			if (key[0] == "@") {
				// The key starts with "@f" which is probably "@font-face"
				// Need to handle this uniquely since @font-face doesn't need brackets around it
				if (key[1] === "f") {
					// Parse the content and add it into our blocks
					blocks += parse(val, key);
				} else {
					// Parse the content and add the whole thing into our blocks
					blocks +=
						// If key starts with "@k" it's probably "@keyframes"
						// In that case, we don't have a parent selector when parsing the block contents
						block(key, parse(val, key[1] === "k" ? "" : selector));
				}
			} else {
				// Otherwise, this is a normal block to parse
				blocks += parse(val, next);
			}
		} else {
			// Otherwise, val is a string

			// When key starts with "@i" it's probably "@import"
			if (key[0] === "@" && key[1] === "i") {
				// Imports need to go in the outer layer
				outer = key + " " + val + ";";
			} else {
				// Convert key from possibly "camelCase" to "kebab-case"
				current += kebab(key) + ":" + val + ";";
			}
		}
	}

	// When parsing properties
	if (current[0]) {
		// Build a new block for these properties
		next = selector ? block(selector, current) : current;

		return outer + next + blocks;
	}

	return outer + blocks;
};

export default parse;
