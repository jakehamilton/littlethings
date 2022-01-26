import { JSONSchema4 } from "json-schema";

export interface Union extends JSONSchema4 {
	anyOf: Array<JSONSchema4>;
	oneOf: Array<JSONSchema4>;
}

export const isUnion = (schema: JSONSchema4): schema is Union => {
	return schema.hasOwnProperty("anyOf") || schema.hasOwnProperty("oneOf");
};

export const VALID_UNION_OPTION_TYPES = [
	"string",
	"number",
	"integer",
	"boolean",
] as const;

export interface UnionOption {
	type: typeof VALID_UNION_OPTION_TYPES[number];
}

export const isValidUnionOption = (option: any): option is UnionOption => {
	return (
		option &&
		option.type &&
		typeof option.type === "string" &&
		VALID_UNION_OPTION_TYPES.includes(option.type)
	);
};

export const getUnionOptions = (schema: Union) => {
	return schema.anyOf || schema.oneOf || [];
};
