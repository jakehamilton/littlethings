import { DefaultThemePalette, Theme, ThemeDriver } from "~/drivers/theme";
import * as tui from "~/drivers/tui";
import { App } from "~/lifecycle/run";
import { Source } from "~/streams/interface";
import { combine } from "~/streams/sources/combine";
import { of } from "~/streams/sources/of";
import { filter } from "~/streams/transformers/filter";
import { map } from "~/streams/transformers/map";
import { when } from "~/streams/transformers/when";
import { pipe } from "~/streams/util/pipe";
import { Direction, TuiDriver, TuiSink } from "..";

export type ButtonProps = {
	text: tui.VNodeChildren;
	focus: Source<boolean>;
	variant?: "solid" | "outline";
};

export const Button: App<
	{ tui: TuiDriver; theme: ThemeDriver<Theme> },
	TuiSink & {
		press: Source<unknown>;
		blur: Source<Direction>;
	},
	ButtonProps
> = (sources, props) => {
	const variant = props.variant ?? "solid";

	const style$ = pipe(
		combine(sources.theme.palette(), props.focus),
		map(([palette, focus]: [DefaultThemePalette, boolean]) => {
			if (focus) {
				return {
					color:
						variant === "outline"
							? palette.accent.background
							: palette.accent.foreground,
					background:
						variant === "outline" ? "transparent" : palette.accent.background,
					borderColor:
						variant === "outline" ? palette.accent.background : "transparent",
				};
			} else {
				return {
					color: palette.accent.foreground,
					background: "transparent",
					borderColor:
						variant === "outline" ? palette.foreground.normal : "transparent",
				};
			}
		}),
	);

	const key$ = pipe(sources.tui.keypress(), when<tui.Key>(props.focus));

	const press$ = pipe(
		key$,
		filter<tui.Key, tui.Key>((key) => key.name === "return"),
	);

	const blur$ = pipe(
		key$,
		filter<tui.Key, tui.Key>(
			(key) => key.shift && tui.isDirectionKeyName(key.name),
		),
		map<tui.Key, tui.Direction>((key) =>
			tui.directionKeyNameToDirection(key.name as tui.DirectionKeyName),
		),
	);

	return {
		press: press$,
		blur: blur$,
		tui: of(
			tui.box(
				{
					paddingLeft: 1,
					paddingRight: 1,
					border: variant === "outline" ? "round" : "none",
					style: style$,
				},
				props.text,
			),
		),
	};
};
