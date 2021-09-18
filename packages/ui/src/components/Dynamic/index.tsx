import type { AnyComponent, ComponentChildren, JSX } from "preact";

export type ElementNames = keyof JSX.IntrinsicElements;

export type DynamicAs = ElementNames | AnyComponent | string;
export type OptionalDynamicAs = DynamicAs | undefined;

export type ComponentProps = {
	class?: string;
	children?: ComponentChildren;
};

export type PropsFromAs<As extends OptionalDynamicAs> = As extends AnyComponent<
	infer Props
>
	? Props
	: As extends ElementNames
	? JSX.IntrinsicElements[As]
	: Record<string, any>;

export type OptionalDynamicProps<
	As extends OptionalDynamicAs,
	DefaultAs extends OptionalDynamicAs = undefined
> = {
	as?: As;
} & (As extends undefined ? PropsFromAs<DefaultAs> : PropsFromAs<As>);

export type DynamicProps<As extends DynamicAs> = {
	as: As;
} & ComponentProps &
	PropsFromAs<As>;

export type WithDynamicProps<As extends DynamicAs, BaseProps> = Omit<
	DynamicProps<As>,
	keyof BaseProps
> &
	BaseProps;

export type DynamicComponent<
	Props extends object = {},
	DefaultAs extends OptionalDynamicAs = undefined
> = <As extends OptionalDynamicAs = DefaultAs>(
	props: Props &
		Omit<ComponentProps, keyof Props> &
		Omit<OptionalDynamicProps<As, DefaultAs>, keyof Props>
) => JSX.Element | null;

const Dynamic = <As extends ElementNames | AnyComponent | string>({
	as,
	children,
	...props
}: DynamicProps<As>): JSX.Element | null => {
	if (as == null) {
		return null;
	}

	// @ts-ignore
	return h(as, props, children);
};

export default Dynamic;
