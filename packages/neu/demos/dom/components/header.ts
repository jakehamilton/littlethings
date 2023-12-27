import { css } from "@littlethings/css";

import * as neu from "~/index";

import { Drivers, Theme } from "..";
import { Github } from "./github";

const HeaderClass = (theme: Theme) =>
	css({
		position: "sticky",
		top: "0",
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		height: "3rem",
		padding: "0 1rem",
		background: theme.background.dark,
		transition: "background 0.25s ease",
		overflow: "hidden",
		zIndex: "100",
	});

const HeaderLeftClass = css({
	display: "flex",
	flexGrow: "1",
});

const LeftTitleClass = (theme: Theme) =>
	css({
		fontSize: "1.25rem",
		fontWeight: "bold",
		fontFamily: theme.font.title,
	});

const NeuClass = (theme: Theme) =>
	css({
		color: theme.accent.background,
		textShadow: `0 0 2.5rem ${theme.accent.background}`,
	});

const HeaderRightClass = css({
	display: "flex",
	justifyContent: "flex-end",
	flexGrow: "1",
});

export const Header: neu.App<Drivers, neu.dom.DomSink> = ({
	dom,
	state,
	history,
	theme,
}) => {
	const isScrolled$ = neu.pipe(
		neu.event("scroll")(window),
		neu.map(() => window.scrollY),
		neu.map((scrollY: number) => scrollY > window.innerHeight * 0.15),
		neu.start(false),
		neu.unique<boolean>(),
	);

	const title$ = neu.pipe(
		isScrolled$,
		neu.map((isScrolled: boolean) =>
			isScrolled
				? neu.dom.span([
						"THE ",
						neu.dom.span({ class: NeuClass(theme) }, "NEU"),
						" WEB",
				  ])
				: "WELCOME TO",
		),
	);

	const style$ = neu.pipe(
		isScrolled$,
		neu.map((isScrolled: boolean) => ({
			color: isScrolled ? theme.accent.foreground : theme.foreground.normal,
			background: isScrolled ? theme.background.normal : "transparent",
		})),
	);

	return {
		dom: neu.of(
			neu.dom.div({ class: HeaderClass(theme), style: style$ }, [
				neu.dom.div({ class: HeaderLeftClass }, [
					neu.dom.h1(
						{
							class: LeftTitleClass(theme),
						},
						[title$],
					),
				]),
				neu.dom.div({ class: HeaderRightClass }, [
					neu.dom.a(
						{
							ariaLabel: "Github",
							href: "https://github.com/jakehamilton/neu",
							target: "_blank",
							rel: "noopener noreferrer",
						},
						[
							Github(
								{ dom, state, history, theme },
								{
									width: 24,
									height: 24,
								},
							),
						],
					),
				]),
			]),
		),
	};
};
