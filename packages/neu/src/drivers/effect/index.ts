import { Driver } from "~/lifecycle/run";
import { Signal, Source } from "~/streams/interface";

export type Effect = () => void;

export type EffectDriver = Driver<Effect, any, {}>;

export type EffectSink = {
	effect: Source<Effect>;
};

export const driver = (): EffectDriver => (source) => {
	source(Signal.Start, (type, data) => {
		if (type === Signal.Data) {
			data();
		}
	});

	return {};
};
