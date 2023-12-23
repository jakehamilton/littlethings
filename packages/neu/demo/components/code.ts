import { css, clsx } from "@littlethings/css";

import * as neu from "~/index";

import { Drivers, Theme } from "..";

export type CodeProps = {
	text: neu.dom.VNode | neu.dom.VNodeStream;
	center?: boolean;
};

const RootClass = (theme: Theme) =>
	css({
		backgroundColor: theme.background.dark,
		borderRadius: "0.5rem",
		overflow: "hidden",
		border: `1px solid ${theme.background.light}`,
		boxShadow: `0 0 10rem 0rem ${theme.accent.background}`,
	});

const HeaderClass = (theme: Theme) =>
	css({
		display: "flex",
		gap: "0.5rem",
		backgroundColor: theme.background.light,
		padding: "0.5rem 0.75rem",
	});

const ButtonClass = css({
	width: "0.75rem",
	height: "0.75rem",
	borderRadius: "50%",
});

const CloseButtonClass = css({
	backgroundColor: "#bf616a",
});

const MinimizeButtonClass = css({
	backgroundColor: "#ebcb8b",
});

const MaximizeButtonClass = css({
	backgroundColor: "#a3be8c",
});

const CodeClass = (center: boolean) =>
	css({
		display: "flex",
		padding: "0.5rem 1rem",
		minWidth: "20rem",
		justifyContent: center ? "center" : "flex-start",
	});

const PreClass = css({});

export const Code: neu.App<
	Drivers,
	{
		dom: neu.dom.VNodeStream;
	},
	CodeProps
> = ({ theme }, { text, center = false }) => {
	return {
		dom: neu.of(
			neu.dom.div({ class: RootClass(theme) }, [
				neu.dom.div({ class: HeaderClass(theme) }, [
					neu.dom.div({ class: clsx(ButtonClass, CloseButtonClass) }),
					neu.dom.div({ class: clsx(ButtonClass, MinimizeButtonClass) }),
					neu.dom.div({ class: clsx(ButtonClass, MaximizeButtonClass) }),
				]),
				neu.dom.code({ class: CodeClass(center) }, [
					neu.dom.pre({ class: PreClass }, text),
				]),
			]),
		),
	};
};
