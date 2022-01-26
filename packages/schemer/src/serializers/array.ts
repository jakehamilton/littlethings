import { Type } from "../util/type";

const serializer = (type: Type) => (identifier: string) => {
	return `${identifier}?.map(item => ${type.serialize("item")})`;
};

export default serializer;
