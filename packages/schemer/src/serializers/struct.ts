export const serialize = (name: string) => (identifier: string) => {
	return `serialize${name}(${identifier})`;
};

export default serialize;
