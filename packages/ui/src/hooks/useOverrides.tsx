import { Inputs } from "preact/hooks";
import { ThemeOverride, ThemeOverrides } from "../types/theme";
import useCSS from "./useCSS";

const useOverrides = <Name extends keyof ThemeOverrides, Props extends object>(
	name: Name,
	props: Props,
	inputs: Inputs = []
): NonNullable<ThemeOverrides[Name]> extends ThemeOverride<infer Classes, Props>
	? Partial<Classes>
	: never => {
	const overrides = useCSS((input) => {
		const factory = input.theme.overrides[name];

		const overrides = factory?.(input, props) ?? {};

		return overrides;
	}, inputs);

	// @ts-expect-error
	return overrides;
};

export default useOverrides;
