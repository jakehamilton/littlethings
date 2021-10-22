import { css, keyframes, glob } from "@littlethings/css";
import { Inputs, useMemo } from "preact/hooks";
import { ThemeUtil } from "../contexts/Theme";
import { CSSClasses } from "../types/css";
import { Theme, ThemeMode } from "../types/theme";
import useTheme from "./useTheme";

export interface CSSFactoryInput {
	css: typeof css;
	glob: typeof glob;
	keyframes: typeof keyframes;
	mode: ThemeMode;
	theme: Theme;
	util: ThemeUtil;
}

export type CSSFactory<Classes extends CSSClasses> = (
	config: CSSFactoryInput
) => Classes;

export const CSS_CACHE = new Map<any, Map<Array<any>, object>>();

const useCSS = <Classes extends CSSClasses>(
	key: any,
	factory: CSSFactory<Classes>,
	inputs: Inputs = []
): Classes => {
	const { mode, theme, util } = useTheme();

	const deps = [mode, theme, ...inputs];

	const classes = useMemo(() => {
		if (!CSS_CACHE.has(key)) {
			CSS_CACHE.set(key, new Map());
		}

		const cache = CSS_CACHE.get(key)!;

		for (const cachedInputs of cache.keys()) {
			let found = true;
			for (let i = 0; i < cachedInputs.length; i++) {
				if (cachedInputs[i] !== deps[i]) {
					found = false;
					break;
				}
			}

			if (found) {
				return cache.get(cachedInputs) as Classes;
			}
		}

		const classes = factory({
			css,
			glob,
			keyframes,
			mode,
			theme,
			util,
		});

		cache.set(deps, classes);

		return classes;
	}, deps);

	return classes;
};

export default useCSS;
