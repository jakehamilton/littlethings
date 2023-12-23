import * as neu from "~/index";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Callout } from "./components/Callout";

export type State = {
	focus: string;
};

export type Drivers = {
	tui: neu.tui.TuiDriver;
	state: neu.state.StateDriver<State>;
	effect: neu.effect.EffectDriver;
};

const app: neu.App<Drivers> = (sources) => {
	neu.pipe(
		sources.tui.keypress(),
		neu.filter(
			(key: neu.tui.Key) => (key.name === "c" && key.ctrl) || key.name === "q",
		),
		neu.each(() => {
			process.exit(0);
		}),
	);

	const main$ = sources.tui.select("main");
	const content$ = sources.tui.select("content");
	const scroll$ = neu.pipe(sources.state.select("scroll"), neu.start(0));
	const size$ = sources.tui.resize(true);

	const scrollUp$ = neu.pipe(
		sources.tui.keypress(),
		neu.filter((key: neu.tui.Key) => key.name === "up" || key.name === "k"),
		neu.to("up"),
	);

	const scrollDown$ = neu.pipe(
		sources.tui.keypress(),
		neu.filter((key: neu.tui.Key) => key.name === "down" || key.name === "j"),
		neu.to("down"),
	);

	const scrollUpState$ = neu.pipe(
		neu.combine(main$, content$, scroll$),
		neu.sample(scrollUp$),
		neu.map(([main, content, scroll]) => {
			const mainLayout = main.yoga.getComputedLayout();
			const contentLayout = content.yoga.getComputedLayout();

			if (mainLayout.height < contentLayout.height) return 0;
			if (scroll - 1 < 0) return scroll;

			return scroll - 1;
		}),
		sources.state.write("scroll"),
	);

	const scrollDownState$ = neu.pipe(
		neu.combine(size$, content$, scroll$),
		neu.sample(scrollDown$),
		neu.map(([size, content, scroll]) => {
			const contentLayout = content.yoga.getComputedLayout();

			if (size.rows >= contentLayout.height) return 0;

			const difference = contentLayout.height - size.rows;

			if (scroll + 1 > difference) return difference;

			return scroll + 1;
		}),
		sources.state.write("scroll"),
	);

	const contentScroll$ = neu.pipe(
		scroll$,
		neu.map((scroll) => -scroll),
	);

	return {
		state: neu.merge(scrollUpState$, scrollDownState$),
		tui: neu.of(
			neu.tui.box(
				{
					flexGrow: 1,
				},
				[
					Header(sources, { scroll: scroll$ }),
					neu.tui.box(
						{
							id: "main",
							alignItems: "center",
							flexGrow: 1,
							overflow: "hidden",
							position: "relative",
						},
						[
							neu.tui.box(
								{
									id: "content",
									padding: 4,
									top: contentScroll$,
								},
								[
									Hero(sources),
									Callout(sources, {
										title: "DYNAMIC",
										description:
											"React in real-time to users, not the other way around. Neu is built on Callbags to enable highly responsive, reactive web applications.",
									}),
									Callout(sources, {
										title: "FAMILIAR",
										description:
											"Build applications like you already know and love. Neu applications are made up of components that are mapped to the DOM just like React and stream data like SolidJS.",
										invert: true,
									}),
									Callout(sources, {
										title: "PREPARED",
										description:
											"One dependency from start to finish. Neu provides all of the utilities needed to build your application. From stream primitives to state to components, Neu has you covered.",
									}),
									Callout(sources, {
										title: "OPEN",
										description:
											"Free to the world, free to you. Neu is Open Source from day one so you can focus on building instead of bureaucracy. Help us build a better web.",
										invert: true,
									}),
								],
							),
						],
					),
				],
			),
		),
	};
};

neu.run<Drivers>({
	app,
	tui: neu.tui.driver(process.stdin, process.stdout),
	state: neu.state.driver({
		focus: "",
		scroll: 0,
	}),
	effect: neu.effect.driver(),
});
