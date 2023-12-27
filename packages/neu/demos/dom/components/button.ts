import { clsx, css } from "@littlethings/css";

import * as neu from "~/index";

const ButtonClass = css({});

export const Button: typeof neu.dom.button = (props, children) => {
	if (
		Array.isArray(props) ||
		neu.dom.isVNode(props) ||
		typeof props === "function"
	) {
		return neu.dom.button({}, props as neu.dom.VNodeChildren);
	} else {
		return neu.dom.button(
			{
				...props,
				class: clsx(ButtonClass, props?.class),
			},
			children,
		);
	}
};
