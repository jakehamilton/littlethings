const kebab = (input: string): string => {
	return input.replace(/[A-Z]/g, "-$&").toLowerCase();
};

export default kebab;
