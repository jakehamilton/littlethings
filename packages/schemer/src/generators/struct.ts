import Coder from "@littlethings/coder";
import { JSONSchema4 } from "json-schema";
import { camel, normalize } from "../util/formatting";
import { isRequired, Struct } from "../util/struct";
import { Type } from "../util/type";

export interface StructGeneratorOptions {
	coder: Coder;
	name: string;
	schema: Struct;
	serializers: {
		name: (identifier: string) => string;
	};
	emit: (name: string, schema: JSONSchema4) => Type;
}

const generate = ({
	coder,
	name,
	schema,
	serializers,
	emit,
}: StructGeneratorOptions) => {
	const props: Array<{
		name: string;
		safeName: string;
		type: Type;
		required: boolean;
	}> = [];

	for (const [propName, propSchema] of Object.entries(schema.properties)) {
		const propTypeName = normalize(serializers.name(`${name}.${propName}`));

		props.push({
			name: propName,
			safeName: camel(propName),
			type: emit(propTypeName, propSchema),
			required: isRequired(schema, propName),
		});
	}

	coder.openBlock(`export interface ${name}`);
	for (const prop of props) {
		coder.line(
			`readonly ${prop.safeName}${prop.required ? "" : "?"}: ${
				prop.type.type
			};`
		);
	}
	coder.closeBlock();

	coder.line();

	coder.openBlock(
		`export const serialize${name} = (options: ${name} | undefined) =>`
	);
	coder.line("if (options === undefined) return undefined;");
	coder.openBlock("const result =");
	for (const prop of props) {
		coder.line(
			`"${prop.name}": ${prop.type.serialize(
				`options.${prop.safeName}`
			)},`
		);
	}
	coder.closeBlock(";");
	coder.line("return result;");
	coder.closeBlock(";");
};

export default generate;
