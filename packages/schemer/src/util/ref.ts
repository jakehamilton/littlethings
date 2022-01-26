import { JSONSchema4 } from "json-schema";

export const DEFINITIONS_PREFIX = "#/definitions/" as const;

export interface Ref extends JSONSchema4 {
	$ref: string;
}

export const isRef = (schema: any): schema is Ref => {
	return (
		schema && typeof schema === "object" && typeof schema.$ref === "string"
	);
};

export const removeRefPrefix = (input: string) => {
	return input.replace(DEFINITIONS_PREFIX, "");
};
