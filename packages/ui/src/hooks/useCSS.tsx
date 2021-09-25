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

const useCSS = <Classes extends CSSClasses>(
	factory: CSSFactory<Classes>,
	inputs: Inputs = []
): Classes => {
	const { mode, theme, util } = useTheme();

	const classes = useMemo(() => {
		return factory({
			css,
			glob,
			keyframes,
			mode,
			theme,
			util,
		});
	}, [mode, theme, ...inputs]);

	return classes;
};

export default useCSS;
