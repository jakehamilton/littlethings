import { ComponentChildren } from "preact";

export type WithChildren<Props = {}> = Props & {
	children: ComponentChildren;
};