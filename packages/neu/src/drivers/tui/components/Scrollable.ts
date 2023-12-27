import { createId } from "@paralleldrive/cuid2";

import * as tui from "~/drivers/tui";

import { DefaultThemePalette, Theme, ThemeDriver } from "~/drivers/theme";
import { App } from "~/lifecycle/run";
import { Source } from "~/streams/interface";
import { combine } from "~/streams/sources/combine";
import { merge } from "~/streams/sources/merge";
import { of } from "~/streams/sources/of";
import { filter } from "~/streams/transformers/filter";
import { fold } from "~/streams/transformers/fold";
import { map } from "~/streams/transformers/map";
import { sample } from "~/streams/transformers/sample";
import { start } from "~/streams/transformers/start";
import { to } from "~/streams/transformers/to";
import { when } from "~/streams/transformers/when";
import { pipe } from "~/streams/util/pipe";

import { Direction, TuiDriver, TuiSink } from "..";

const calculateScroll = (
	scroll: number,
	[root, content, action]: [
		root: tui.TuiNode,
		content: tui.TuiNode,
		action: "up" | "down" | "resize",
	],
) => {
	const rootLayout = root.yoga.getComputedLayout();
	const contentLayout = content.yoga.getComputedLayout();

	if (
		Number.isNaN(rootLayout.width) ||
		Number.isNaN(rootLayout.height) ||
		Number.isNaN(contentLayout.width) ||
		Number.isNaN(contentLayout.height)
	) {
		return 0;
	}

	if (contentLayout.height < rootLayout.height) {
		return 0;
	}

	if (action === "resize") {
		return scroll;
	}

	const next = scroll + (action === "up" ? -1 : action === "down" ? 1 : 0);

	if (next < 0) {
		return 0;
	}

	if (next > contentLayout.height - rootLayout.height) {
		return contentLayout.height - rootLayout.height;
	}

	return next;
};

export type ScrollableProps = {
	children: tui.VNodeChildren;
	focus: Source<boolean>;
	scrollbar?: boolean;
};

export const Scrollable: App<
	{ tui: TuiDriver; theme: ThemeDriver<Theme> },
	TuiSink & {
		blur: Source<Direction>;
	},
	ScrollableProps
> = (sources, props) => {
	const { scrollbar = true } = props;

	const rootId = createId();
	const contentId = createId();

	const scrollUp$ = pipe(
		sources.tui.keypress(),
		when<tui.Key>(props.focus),
		filter((key: tui.Key) => key.name === "up" || key.name === "k"),
		to("up" as const),
	);

	const scrollDown$ = pipe(
		sources.tui.keypress(),
		when<tui.Key>(props.focus),
		filter((key: tui.Key) => key.name === "down" || key.name === "j"),
		to("down" as const),
	);

	const scrollUpAndDown$ = pipe(
		merge(scrollUp$, scrollDown$),
		start<"up" | "down">("up" as const),
	);

	const scrollSource$ = combine(
		sources.tui.select(rootId),
		sources.tui.select(contentId),
		scrollUpAndDown$,
	);

	const resizeScrollSource$ = pipe(
		scrollSource$,
		sample<[tui.TuiNode, tui.TuiNode, "up" | "down"]>(sources.tui.resize(true)),
		map<
			[tui.TuiNode, tui.TuiNode, "up" | "down"],
			[tui.TuiNode, tui.TuiNode, "resize"]
		>(([root, content, _action]: [tui.TuiNode, tui.TuiNode, "up" | "down"]) => [
			root,
			content,
			"resize" as const,
		]),
	);

	const scroll$ = pipe(
		merge(scrollSource$, resizeScrollSource$),
		fold(calculateScroll, 0),
	);

	const rootStyle$ = pipe(
		combine(sources.theme.palette(), props.focus),
		map(([palette, focus]: [DefaultThemePalette, boolean]) => {
			if (focus) {
				return {};
			} else {
				return {};
			}
		}),
	);

	const contentStyle$ = pipe(
		scroll$,
		start(0),
		map((scroll: number) => {
			return {
				top: -scroll,
				paddingRight: scrollbar ? 1 : 0,
			};
		}),
	);

	const key$ = pipe(sources.tui.keypress(), when<tui.Key>(props.focus));

	const blur$ = pipe(
		key$,
		filter<tui.Key, tui.Key>(
			(key) => key.shift && tui.isDirectionKeyName(key.name),
		),
		map<tui.Key, tui.Direction>((key) =>
			tui.directionKeyNameToDirection(key.name as tui.DirectionKeyName),
		),
	);

	const scrollPosition$ = pipe(
		combine(scroll$, sources.tui.select(rootId), sources.tui.select(contentId)),
		map<[number, tui.TuiNode, tui.TuiNode], number>(
			([scroll, root, content]) => {
				const rootLayout = root.yoga.getComputedLayout();
				const contentLayout = content.yoga.getComputedLayout();

				if (
					Number.isNaN(rootLayout.width) ||
					Number.isNaN(rootLayout.height) ||
					Number.isNaN(contentLayout.width) ||
					Number.isNaN(contentLayout.height)
				) {
					return 0;
				}

				const maxScroll = Math.max(0, contentLayout.height - rootLayout.height);

				const position = Math.round((scroll / maxScroll) * rootLayout.height);

				return Math.min(position, rootLayout.height - 1);
			},
		),
	);

	const scrollThumbStyle$ = pipe(
		scrollPosition$,
		map((scrollPosition) => ({
			top: scrollPosition,
		})),
	);

	return {
		blur: blur$,
		tui: of(
			tui.box(
				{
					id: rootId,
					position: "relative",
					overflow: "hidden",
					width: "100%",
					height: "100%",
					style: rootStyle$,
				},
				[
					tui.box(
						{
							id: contentId,
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							style: contentStyle$,
						},
						props.children,
					),
					scrollbar
						? tui.box(
								{
									position: "absolute",
									top: 0,
									right: 0,
									bottom: 0,
									height: "100%",
									background: "blackBright",
								},
								tui.box(
									{
										style: scrollThumbStyle$,
									},
									"█",
								),
						  )
						: null,
				],
			),
		),
	};
};
