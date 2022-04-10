import Coder from "@littlethings/coder";
import { pascal } from "../util/formatting";

export interface EnumGeneratorOptions {
	coder: Coder;
	name: string;
	members: Array<string>;
}

const generate = ({ coder, name, members }: EnumGeneratorOptions) => {
	coder.openBlock(`export enum ${name}`);

	for (const value of members) {
		let member = pascal(value);

		// Prefix names that don't start with a letter
		if (!/^[a-z].*/i.test(member)) {
			member = "_" + member;
		}

		coder.line(`"${member}" = "${value}",`);
	}

	coder.closeBlock();
};

export default generate;
