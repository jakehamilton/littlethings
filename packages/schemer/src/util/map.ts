import { JSONSchema4 } from "json-schema";

export interface Map extends JSONSchema4 {
	additionalProperties: Array<JSONSchema4>;
}

export const isMap = (schema: JSONSchema4): schema is Map => {
	return (
		schema.hasOwnProperty("additionalProperties") &&
		typeof schema.additionalProperties === "object"
	);
};
