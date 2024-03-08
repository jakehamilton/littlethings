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
import { share } from "~/streams/util/share";

import { Direction, TuiDriver, TuiSink } from "..";
import { concat } from "~/streams/transformers/concat";

const calculateScroll = (
	scroll: number,
	[root, content, focused]: [
		root: tui.TuiNode,
		content: tui.TuiNode,
		focused: number,
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

	const wrapper = content.children[0];

	if (!wrapper || typeof wrapper === "string") {
		return scroll;
	}

	let offset = 0;

	for (let i = 0; i < focused; i++) {
		const item = wrapper.children[i];

		if (!item) {
			continue;
		}

		if (typeof item === "string") {
			offset++;
		} else {
			const itemLayout = item.yoga.getComputedLayout();
			offset += itemLayout.height;
		}
	}

	const item = wrapper.children[focused];

	if (!item) {
		return scroll;
	}

	if (typeof item === "string") {
		if (contentLayout.height > offset) {
			return 0;
		} else if (focused > contentLayout.height) {
			// TODO: Actually write this logic.
			return scroll;
		} else {
			// TODO: Actually write this logic.
			return scroll;
		}
	}

	const itemLayout = item.yoga.getComputedLayout();

	if (offset < scroll) {
		return offset;
	} else if (offset > scroll + rootLayout.height) {
		return offset;
	} else if (
		offset + itemLayout.height > scroll + rootLayout.height &&
		itemLayout.height < rootLayout.height
	) {
		return offset + itemLayout.height - rootLayout.height;
	}

	return scroll;
};

export type ListItemProps = {
	focus: Source<boolean>;
};

export type ListItem = {
	child: (props: ListItemProps) => tui.VNode | tui.VNodeStream;
};

export type ListProps = {
	items: Source<Array<ListItem>>;
	focus: Source<boolean>;
	scrollbar?: boolean;
};

export const List: App<
	{ tui: TuiDriver; theme: ThemeDriver<Theme> },
	TuiSink & {
		pick: Source<number>;
		blur: Source<Direction>;
	},
	ListProps
> = (sources, props) => {
	const { scrollbar = true } = props;

	const rootId = `root-${createId()}`;
	const contentId = `content-${createId()}`;

	const moveUp$ = pipe(
		sources.tui.keypress(),
		when<tui.Key>(props.focus),
		filter((key: tui.Key) => key.name === "up" || key.name === "k"),
		to("up" as const),
	);

	const moveDown$ = pipe(
		sources.tui.keypress(),
		when<tui.Key>(props.focus),
		filter((key: tui.Key) => key.name === "down" || key.name === "j"),
		to("down" as const),
	);

	const move$ = pipe(merge(moveUp$, moveDown$));

	const focused$ = share(
		pipe(
			combine(move$, props.items),
			fold<["up" | "down", Array<ListItem>], number>(
				(focused, [direction, items]) => {
					const next = direction === "up" ? focused - 1 : focused + 1;

					if (next < 0) {
						return 0;
					}

					if (next >= items.length) {
						return items.length - 1;
					}

					return next;
				},
				0,
			),
			start(0),
		),
	);

	const select$ = pipe(
		sources.tui.keypress(),
		when<tui.Key>(props.focus),
		filter((key: tui.Key) => key.name === "return"),
	);

	const pick$ = pipe(focused$, sample<number>(select$));

	const state$ = combine(
		sources.tui.select(rootId),
		sources.tui.select(contentId),
		focused$,
	);

	const resizeState$ = pipe(
		state$,
		sample<[tui.TuiNode, tui.TuiNode, number]>(sources.tui.resize(true)),
	);

	const scroll$ = pipe(merge(state$, resizeState$), fold(calculateScroll, 0));

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
				paddingRight: scrollbar ? 1 : 0,
				top: -scroll,
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

	const children$ = pipe(
		props.items,
		map<Array<ListItem>, tui.VNode>((items) =>
			tui.box(
				{
					width: "100%",
				},
				items.map((item, i) =>
					item.child({
						focus: pipe(
							focused$,
							map((focused) => focused === i),
							start(i === 0),
							concat<boolean, boolean>(props.focus),
							map(
								([itemFocus, listFocus]: [boolean, boolean]) =>
									itemFocus && listFocus,
							),
						),
					}),
				),
			),
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

				return Math.round((scroll / contentLayout.height) * rootLayout.height);
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
		pick: pick$,
		blur: blur$,
		tui: of(
			tui.box(
				{
					id: rootId,
					position: "relative",
					overflow: "hidden",
					flexGrow: 1,
					style: rootStyle$,
				},
				[
					tui.box(
						{
							id: contentId,
							position: "absolute",
							top: 0,
							left: 0,
							style: contentStyle$,
						},
						[children$],
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
