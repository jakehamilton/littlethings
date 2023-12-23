import { Driver } from "..";

export type EffectDriver = Driver<any, any, any>;

export const driver = (): EffectDriver => (_source) => {
	return {};
};
