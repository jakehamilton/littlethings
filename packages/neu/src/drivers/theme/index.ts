import { Driver } from "~/lifecycle/run";
import { Signal, Source, Transformer } from "~/streams/interface";
import { to } from "~/streams/transformers/to";
import { pipe } from "~/streams/util/pipe";
import { Color } from "../tui";

export type DefaultThemePalette = {
	accent: {
		foreground: Color;
		background: Color;
	};

	foreground: {
		light: Color;
		normal: Color;
		dark: Color;
	};

	background: {
		light: Color;
		normal: Color;
		dark: Color;
	};
};

export type ThemePalette = {
	[component: string]: {
		[variant: string]: Color;
	};
};

export type Theme = {
	[mode: string]: DefaultThemePalette & ThemePalette;
};

export type ThemeModeAction<
	UserTheme extends Theme,
	Variant extends keyof UserTheme = keyof UserTheme,
> = {
	type: "mode";
	value: Variant;
};

export type ThemeAction<UserTheme extends Theme> = ThemeModeAction<UserTheme>;

export type ThemeDriver<UserTheme extends Theme> = Driver<
	ThemeAction<UserTheme>,
	unknown,
	ThemeSource<UserTheme>
>;

export type ThemeSource<UserTheme extends Theme> = {
	switch: <Mode extends keyof UserTheme>(
		mode: Mode,
	) => Transformer<unknown, ThemeModeAction<UserTheme, Mode>>;
	mode: () => Source<keyof UserTheme>;
	palette: () => Source<UserTheme[keyof UserTheme]>;
};

export const driver =
	<UserTheme extends Theme>(
		theme: UserTheme,
		mode: keyof UserTheme,
	): ThemeDriver<UserTheme> =>
	(source) => {
		const modeListeners: Array<(mode: keyof UserTheme) => void> = [];
		const paletteListeners: Array<
			(palette: UserTheme[keyof UserTheme]) => void
		> = [];

		let currentMode = mode;
		let currentTheme = theme[currentMode];

		source(Signal.Start, (type, data) => {
			if (type === Signal.Data) {
				if (data.type === "mode") {
					currentMode = data.value;
					currentTheme = theme[currentMode];

					for (const listener of modeListeners) {
						listener(currentMode);
					}
					for (const listener of paletteListeners) {
						listener(currentTheme);
					}
				}
			}
		});

		return {
			switch: (mode) => (source) => {
				return pipe(
					source,
					to<ThemeModeAction<UserTheme, typeof mode>>({
						type: "mode",
						value: mode,
					}),
				);
			},
			mode: () => (type, sink) => {
				if (type !== Signal.Start) {
					return;
				}

				const listener = (mode: keyof UserTheme) => {
					sink(Signal.Data, mode);
				};

				sink(Signal.Start, (type, _data) => {
					if (type === Signal.End) {
						const listeners = modeListeners;
						const index = listeners.indexOf(listener);

						if (index !== -1) {
							listeners.splice(index, 1);
						}
					}
				});

				modeListeners.push(listener);

				sink(Signal.Data, currentMode);
			},
			palette: () => (type, sink) => {
				if (type !== Signal.Start) {
					return;
				}

				const listener = (palette: UserTheme[keyof UserTheme]) => {
					sink(Signal.Data, palette);
				};

				sink(Signal.Start, (type, _data) => {
					if (type === Signal.End) {
						const listeners = paletteListeners;
						const index = listeners.indexOf(listener);

						if (index !== -1) {
							listeners.splice(index, 1);
						}
					}
				});

				paletteListeners.push(listener);

				sink(Signal.Data, currentTheme);
			},
		};
	};
