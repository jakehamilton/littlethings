import { clsx } from "@littlethings/css";
import { Inputs, useMemo } from "preact/hooks";
import { CSSClass } from "../types/css";

const useClasses = <Classes extends object>(
	classes: Array<Partial<Classes> | null | undefined>,
	inputs: Inputs = []
): Partial<Classes> => {
	const result = useMemo(() => {
		const output: Partial<Classes> = {};

		const merged: Record<string, Array<CSSClass>> = {};

		for (const object of classes) {
			if (object == null) {
				continue;
			}

			for (const [key, className] of Object.entries(object)) {
				if (typeof className !== "string") {
					continue;
				}

				if (merged.hasOwnProperty(key)) {
					merged[key].push(className);
				} else {
					merged[key] = [className];
				}
			}
		}

		for (const [key, classNames] of Object.entries(merged)) {
			// @ts-expect-error
			// Not sure if there's a way to type this function so that
			// it's possible to index the Classes object. Since it's
			// generic and completely user-customizeable, it might
			// not be possible. Instead, we'll just ignore the error
			// that TypeScript would throw here when attempting to
			// assign the `key` (unknown) on `output`.
			output[key] = clsx(...classNames);
		}

		return output;
	}, [...classes, ...inputs]);

	return result;
};

export default useClasses;
