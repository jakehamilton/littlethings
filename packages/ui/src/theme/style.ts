import { css, clsx } from "@littlethings/css";
import { CSSDefinitions } from "@littlethings/css/dist/types/css";
import { Inputs, useMemo } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import { ThemeContextValue } from "../contexts/Theme";
import useTheme from "../hooks/useTheme";
import { CSSClass } from "../types/css";
import { Theme, ThemeMode, ThemeOverrides } from "../types/theme";

export type StylesValue = JSX.CSSProperties | Styles | string | undefined;

export type NestedModeStyles = JSX.CSSProperties & {
	[key: string]: StylesValue;
};

export type Styles = {
	"@dark"?: NestedModeStyles;
	"@light"?: NestedModeStyles;
	[key: string]: StylesValue | NestedModeStyles | undefined;
};

export type StyleClasses = {
	[key: string]: StylesValue;
};

export type StyleUtil = {
	css: typeof css;
	keyframes: typeof css;
	clsx: typeof clsx;
};

export type StyleFactory<Classes extends StyleClasses> = (
	theme: ThemeContextValue,
	util: StyleUtil
) => Classes;
export type StyleFactoryWithProps<Props, Classes extends StyleClasses> = (
	theme: ThemeContextValue,
	util: StyleUtil,
	props: Props
) => Classes;

type CompiledClasses<Classes extends StyleClasses> = {
	[key in keyof Classes]: Classes[key] extends undefined ? never : string;
};

type StyleHook<Classes extends StyleClasses> = () => [
	CompiledClasses<Classes>,
	typeof clsx
];
type StyleHookWithProps<Props, Classes extends StyleClasses> = (
	props: Props,
	inputs?: Inputs
) => [CompiledClasses<Classes>, typeof clsx];

type OverridesHook<Classes extends StyleClasses> = (
	name: keyof ThemeOverrides
) => Partial<CompiledClasses<Classes>>;
type OverridesHookWithProps<Props, Classes extends StyleClasses> = (
	name: keyof ThemeOverrides,
	props: Props,
	inputs?: Inputs
) => Partial<CompiledClasses<Classes>>;

type ClassesHook<Classes extends StyleClasses> = (
	...classes: Array<
		| CompiledClasses<Classes>
		| CompiledClasses<Partial<Classes>>
		| null
		| undefined
	>
) => CompiledClasses<Partial<Classes>>;

const isStyleFactoryWithProps = <Props, Classes extends StyleClasses>(
	factory: StyleFactory<Classes> | StyleFactoryWithProps<Props, Classes>
): factory is StyleFactoryWithProps<Props, Classes> => {
	return factory.length > 2;
};

const normalizeStyles = (mode: ThemeMode, styles: Styles) => {
	const result: Styles = {};

	for (const key of Object.keys(styles)) {
		if (styles[key] === undefined) {
			continue;
		}

		if (key === "@light") {
			if (mode === "light") {
				const inner = normalizeStyles(mode, styles[key] as Styles);

				Object.assign(result, inner);
			}
		} else if (key === "@dark") {
			if (mode === "dark") {
				const inner = normalizeStyles(mode, styles[key] as Styles);

				Object.assign(result, inner);
			}
		} else {
			result[key] = styles[key];
		}
	}

	return result;
};

const normalizeClasses = <Classes extends StyleClasses>(
	mode: ThemeMode,
	classes: Classes
) => {
	const result: Classes = {} as Classes;

	for (const key of Object.keys(classes)) {
		// @ts-expect-error
		result[key] = normalizeStyles(mode, classes[key] as Styles);
	}

	return result;
};

let GLOBAL_STYLESHEET_COUNTER = 0;

export function style<Classes extends StyleClasses>(
	factory: StyleFactory<Classes>
): {
	useStyles: StyleHook<Classes>;
	useOverrides: OverridesHook<Classes>;
	useClasses: ClassesHook<Classes>;
};
export function style<Props, Classes extends StyleClasses>(
	factory: StyleFactoryWithProps<Props, Classes>
): {
	useStyles: StyleHookWithProps<Props, Classes>;
	useOverrides: OverridesHookWithProps<Props, Classes>;
	useClasses: ClassesHook<Classes>;
};

export function style<Props, Classes extends StyleClasses>(
	factory: StyleFactoryWithProps<Props, Classes> | StyleFactory<Classes>
) {
	const key = GLOBAL_STYLESHEET_COUNTER++;
	const id = `#ui-${key}`;

	let stylesheet = document.querySelector(id);

	if (!stylesheet) {
		stylesheet = document.createElement("style");
		stylesheet.setAttribute("id", id);

		document.head.appendChild(stylesheet);
	}

	const scopedCSS = css.bind({
		target: stylesheet,
	});

	const scopedKeyframes = css.bind({
		target: stylesheet,
		keyframes: true,
	});

	const scopedCLSX = clsx.bind({
		target: stylesheet,
	});

	const util: StyleUtil = {
		css: scopedCSS,
		keyframes: scopedKeyframes,
		clsx: scopedCLSX,
	};

	const caches = {
		light: new Map<Inputs, CompiledClasses<Classes>>(),
		dark: new Map<Inputs, CompiledClasses<Classes>>(),
	};

	const hasProps = isStyleFactoryWithProps(factory);

	const render = (
		mode: ThemeMode,
		target: Classes,
		props?: Props,
		inputs: Inputs = []
	) => {
		const cache = caches[mode];

		for (const cachedInputs of cache.keys()) {
			let found = true;

			for (let i = 0; i < cachedInputs.length; i++) {
				if (cachedInputs[i] !== inputs[i]) {
					found = false;
				}
			}

			if (found) {
				return cache.get(cachedInputs);
			}
		}

		const classes: CompiledClasses<Classes> =
			{} as CompiledClasses<Classes>;

		for (const name of Object.keys(target)) {
			// @ts-expect-error
			classes[name as keyof Classes] = scopedCSS(
				target[name] as CSSDefinitions
			);
		}

		cache.set(inputs, classes);

		return classes;
	};

	const useStyles = (props?: Props, inputs: Inputs = []) => {
		const theme = useTheme();

		const deps = [theme.spec, ...inputs];

		const generated = useMemo(() => {
			return factory(theme, util, props!);
		}, deps);

		const normalized = useMemo(() => {
			const light = normalizeClasses("light", generated);
			const dark = normalizeClasses("dark", generated);

			return { light, dark };
		}, [generated]);

		const rendered = useMemo(() => {
			return {
				light: render("light", normalized.light, props, deps),
				dark: render("dark", normalized.dark, props, deps),
			};
		}, [generated]);

		const classes = theme.mode === "light" ? rendered.light : rendered.dark;

		return [classes, scopedCLSX];
	};

	const useOverrides = (
		name: keyof Theme["overrides"],
		props?: Props,
		inputs: Inputs = []
	) => {
		const theme = useTheme();

		const deps = [theme.spec, ...inputs];

		const generated = useMemo(() => {
			const override = theme.theme.overrides[name];

			if (override === undefined) {
				return {};
			}

			return override(theme, util, props!);
		}, deps);

		const normalized = useMemo(() => {
			const light = normalizeClasses("light", generated);
			const dark = normalizeClasses("dark", generated);

			return { light, dark };
		}, [generated]);

		const rendered = useMemo(() => {
			return {
				// @ts-expect-error
				light: render("light", normalized.light, props, deps),
				// @ts-expect-error
				dark: render("dark", normalized.dark, props, deps),
			};
		}, [normalized]);

		const classes = theme.mode === "light" ? rendered.light : rendered.dark;

		return classes as Partial<CompiledClasses<Classes>>;
	};

	const useClasses = (
		...classes: Array<
			| CompiledClasses<Classes>
			| CompiledClasses<Partial<Classes>>
			| null
			| undefined
		>
	): CompiledClasses<Partial<Classes>> => {
		const result = useMemo(() => {
			const output: CompiledClasses<Partial<Classes>> =
				{} as CompiledClasses<Partial<Classes>>;

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
				output[key] = scopedCLSX(...classNames);
			}

			return output;
		}, classes);

		return result;
	};

	return {
		useStyles,
		useOverrides,
		useClasses,
	};
}
