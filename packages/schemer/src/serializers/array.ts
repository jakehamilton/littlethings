import { Type } from "../util/type";

const serializer = (type: Type) => (identifier: string) => {
	return `prelude.serialize(${identifier}, items => items.map(item => ${type.serialize(
		"item"
	)}).filter(prelude.isNotUndefined))`;
};

export default serializer;
