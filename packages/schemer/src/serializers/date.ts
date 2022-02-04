const serialize = (identifier: string) => {
	return `${identifier}?.toISOString()`;
};

export default serialize;
