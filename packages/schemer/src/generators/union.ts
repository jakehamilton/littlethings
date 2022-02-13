import Coder from "@littlethings/coder";

export interface UnionGeneratorOptions {
	coder: Coder;
	name: string;
	options: Array<string>;
}

const generate = ({ coder, name, options }: UnionGeneratorOptions) => {
	coder.line(`export type ${name} = ${options.join(" | ")};`);

	coder.openBlock(
		`export const is${name} = (input: any): input is ${name} =>`
	);
	const quotedOptions = options.map((option) => `"${option}"`);
	coder.line(`return [${quotedOptions.join(", ")}].includes(typeof input);`);
	coder.closeBlock(";");
};

export default generate;
