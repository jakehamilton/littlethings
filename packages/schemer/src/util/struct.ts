import { JSONSchema4 } from "json-schema";

export interface Struct extends JSONSchema4 {
	properties: JSONSchema4;
}

export const isStruct = (schema: JSONSchema4): schema is Struct => {
	return schema.hasOwnProperty("properties");
};

export const isRequired = (schema: Struct, name: string) => {
	return Array.isArray(schema.required) && schema.required.includes(name);
};
