import { JSONSchema4 } from "json-schema";

export interface Pattern extends JSONSchema4 {
	pattern: string;
}

export const isPattern = (schema: JSONSchema4): schema is Pattern => {
	return (
		schema && schema.type === "string" && typeof schema.pattern === "string"
	);
};
