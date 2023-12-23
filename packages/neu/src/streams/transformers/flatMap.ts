import { Source, Transformer } from "~/streams/interface";
import { pipe } from "~/streams/util/pipe";
import { flat } from "~/streams/transformers/flat";
import { map } from "~/streams/transformers/map";

export const flatMap =
	<Input, Output>(
		fn: (value: Input) => Output | Source<Output>,
	): Transformer<Input, Output> =>
	(source) => {
		return pipe(
			source,
			map<Input, Output | Source<Output>>(fn),
			flat<Output>(),
		);
	};
