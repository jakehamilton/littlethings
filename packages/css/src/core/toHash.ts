import { CLASS_PREFIX } from "../util/prefix";

const toHash = (input: string) => {
	let i = 0;
	let out = 11;

	while (i < input.length) {
		out = (101 * out + input.charCodeAt(i++)) >>> 0;
	}

	return CLASS_PREFIX + out;
};

export default toHash;
