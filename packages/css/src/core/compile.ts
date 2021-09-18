const compile = (
	strings: TemplateStringsArray,
	data: Array<string>
): string => {
	const result = strings.reduce((out, next, i) => {
		let tail = data[i];

		return out + next + (tail == null ? "" : tail);
	}, "");

	return result;
};

export default compile;
