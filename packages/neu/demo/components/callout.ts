import { css } from "@littlethings/css";
import { Drivers, Theme } from "demo";

import * as neu from "~/index";

export type CalloutProps = {
	title: neu.dom.VNode | neu.dom.VNodeStream;
	description: neu.dom.VNode | neu.dom.VNodeStream;
	invert?: boolean;
};

const CalloutClass = (invert: boolean) =>
	css({
		display: "flex",
		flexDirection: "column",
		alignItems: invert ? "flex-end" : "flex-start",
		padding: "1rem 2rem",
	});

const TitleClass = (theme: Theme, invert: boolean) =>
	css({
		fontFamily: theme.font.title,
		fontSize: "3.5rem",
		textAlign: invert ? "right" : "left",
		color: theme.accent.background,
		textShadow: `0 0 4.5rem ${theme.accent.background}`,
	});

const DescriptionClass = (invert: boolean) =>
	css({
		maxWidth: "28rem",
		textAlign: "justify",
	});

export const Callout: neu.App<
	Drivers,
	{
		dom: neu.dom.VNodeStream;
	},
	CalloutProps
> = ({ theme }, { title, description, invert = false }) => {
	return {
		dom: neu.of(
			neu.dom.div({ class: CalloutClass(invert) }, [
				neu.dom.h3({ class: TitleClass(theme, invert) }, [title]),
				neu.dom.p({ class: DescriptionClass(invert) }, [description]),
			]),
		),
	};
};
