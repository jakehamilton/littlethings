import camelcase from "camelcase";

export const camel = (input: string) => {
	return camelcase(input, {
		preserveConsecutiveUppercase: true,
	});
};

export const pascal = (input: string) => {
	return camelcase(input, {
		pascalCase: true,
		preserveConsecutiveUppercase: true,
	});
};

export const normalize = (name: string) => {
	return pascal(name);
};
