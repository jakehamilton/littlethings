import { ClassAttributes, ComponentChildren } from "preact";

export interface CommonProps {
	class?: string;
	children?: ComponentChildren;
}

export type WithCommonProps<Props> = Props & CommonProps;

export type WithChildren<Props> = Props & {
	children: ComponentChildren;
};
