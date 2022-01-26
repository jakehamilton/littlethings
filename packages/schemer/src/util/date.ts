import { JSONSchema4 } from "json-schema";

export const isDate = (schema: JSONSchema4) => {
	return schema.format === "date-time";
};
