import { css } from "@littlethings/css";

import * as neu from "~/index";

import { Drivers, Theme } from "..";

const DOT_DIAMETER = 20;
const DOT_SPACING = 25;
const DOT_OVERSCAN = DOT_DIAMETER * 2;

const DotsClass = css({
	position: "relative",
	height: `${DOT_DIAMETER * 4}px`,
	width: "100%",
	overflow: "hidden",
});

const DotClass = (theme: Theme, isEven: boolean) =>
	css({
		position: "absolute",
		top: "50%",
		width: `${DOT_DIAMETER}px`,
		height: `${DOT_DIAMETER}px`,
		borderRadius: "50%",
		background: isEven ? theme.background.normal : theme.background.light,
		zIndex: "1",
		transform: "translateX(-100%)",
		"@media (prefers-reduced-motion)": {
			transform: "translateX(-100%) !important",
		},
	});

export type DotsProps = {
	invert?: boolean;
	speed?: number;
	sine?: boolean;
};

export const Dots: neu.App<Drivers, { dom: neu.dom.VNodeStream }, DotsProps> = (
	{ theme },
	{ invert = false, speed = 0.25, sine = false },
) => {
	const scroll$ = neu.broadcast(
		neu.pipe(
			neu.event("scroll")(window),
			neu.map(() => window.scrollY),
		),
	);

	const size$ = neu.pipe(
		neu.event("resize")(window),
		neu.map(() => ({ width: window.innerWidth, height: window.innerHeight })),
		neu.start({ width: window.innerWidth, height: window.innerHeight }),
	);

	const style = (index: number) =>
		neu.pipe(
			scroll$,
			neu.start(0),
			neu.map((offset: number) => {
				// NOTE: Why isn't this a single transform on the parent?
				// These dots were originally going to animate in a Sine wave and functionality may
				// change in the future, so individual transforms are being applied to each element.
				return {
					transform: `translateY(-50%) translateX(${
						DOT_DIAMETER * index + DOT_SPACING * index - DOT_OVERSCAN / 2
					}px) translateX(-${window.innerWidth / 2}px) translateX(${
						invert ? "-" : ""
					}${offset * speed}px) translateY(${
						sine ? Math.sin((offset / 8 + index * 5) * 0.05) * DOT_DIAMETER : 0
					}px)`,
				};
			}),
		);

	const dots$ = neu.pipe(
		size$,
		neu.map(
			(size: { width: number; height: number }) =>
				// prettier-ignore
				2 * Math.floor(
					(
						(size.width > size.height ? size.width : size.height)
						+ DOT_OVERSCAN
					)
					/ (DOT_DIAMETER + DOT_SPACING),
				),
		),
	);

	const dom$ = neu.pipe(
		dots$,
		neu.map((dots: number) =>
			neu.dom.div(
				{ class: DotsClass },
				Array.from({ length: dots }, (_, i) => {
					return neu.dom.div({
						class: DotClass(theme, i % 2 === 0),
						style: style(i),
					});
				}),
			),
		),
	);

	return {
		dom: dom$,
	};
};
