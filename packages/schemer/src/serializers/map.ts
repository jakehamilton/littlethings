import { Type } from "../util/type";

const serialize = (type: Type) => (identifier: string) => {
	return `((${identifier}) === undefined) ? undefined : (Object.entries(${identifier}).reduce((r, i) => (i[1] === undefined) ? r : ({ ...r, [i[0]]: ${type.serialize(
		"i[1]"
	)} }), {}))`;
};

export default serialize;
