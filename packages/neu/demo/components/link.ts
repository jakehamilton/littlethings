import * as neu from "~/index";

import { Drivers, Theme } from "..";
import { clsx, css } from "@littlethings/css";

const LinkClass = (theme: Theme) =>
	css({
		color: theme.accent.background,
		textDecoration: "underline",
		textUnderlineOffset: "0.175rem",
	});

export type LinkProps = {
	text: neu.dom.VNode | neu.dom.VNodeStream;
	href: string;
	[key: string]: any;
};

export const Link: neu.App<Drivers, {}, LinkProps> = ({ theme }, props) => {
	const { text, ...rest } = props;

	return {
		dom: neu.of(
			neu.dom.a(
				{
					...rest,
					class: clsx(LinkClass(theme), rest?.class),
				},
				[text],
			),
		),
	};
};
