import { CSSDefinitions } from "../types/css";

const stringify = (data: CSSDefinitions) => {
	let result = "";

	for (const key in data) {
		const value = data[key];

		result += key + (typeof value === "object" ? stringify(value) : value);
	}

	return result;
};

export default stringify;
