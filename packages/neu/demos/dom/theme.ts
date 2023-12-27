import * as neu from "~/index";

export type ThemeDriver<T> = neu.Driver<any, unknown, T>;

export const driver =
	<T>(theme: T): ThemeDriver<T> =>
	(_source) => {
		return theme;
	};
