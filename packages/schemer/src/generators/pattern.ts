import Coder from "@littlethings/coder";

export interface PatternGeneratorOptions {
	coder: Coder;
	name: string;
	pattern: string;
}

const generate = ({ coder, name, pattern }: PatternGeneratorOptions) => {
	coder.line(`export type ${name} = string & { __type: "${name}" };`);

	coder.openBlock(
		`export const is${name} = (input: string): input is ${name} =>`
	);
	coder.line(
		`const regex = new RegExp("${pattern.replaceAll('"', '\\"')}");`
	);
	coder.line(`return regex.test(input);`);
	coder.closeBlock(";");
};

export default generate;
