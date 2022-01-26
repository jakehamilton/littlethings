import { JSONSchema4 } from "json-schema";

export interface Enum extends JSONSchema4 {
	enum: Array<string>;
}

export const isEnum = (schema: JSONSchema4): schema is Enum => {
	return Boolean(
		schema.enum &&
			Array.isArray(schema.enum) &&
			schema.enum.length > 0 &&
			schema.enum.every((item) => typeof item === "string")
	);
};
