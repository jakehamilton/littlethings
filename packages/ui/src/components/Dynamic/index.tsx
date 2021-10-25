import type {
	AnyComponent,
	ComponentChildren,
	FunctionComponent,
	JSX,
	Ref,
} from "preact";

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

export type RefFromAs<As extends OptionalDynamicAs = undefined> = [As] extends [
	undefined
]
	? unknown
	: As extends ElementNames
	? JSX.IntrinsicElements[As] extends JSX.HTMLAttributes<infer Element>
		? JSX.HTMLAttributes<Element>["ref"]
		: unknown
	: As extends (p: any, r: infer ComponentRef) => ComponentChildren
	? ComponentRef
	: As extends FunctionComponent<infer Props>
	? Props extends { innerRef?: infer InnerRef }
		? InnerRef
		: unknown
	: unknown;

export type DynamicProps<As extends DynamicAs> = {
	as: As;
	innerRef?: RefFromAs<As>;
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
		Omit<OptionalDynamicProps<As, DefaultAs>, keyof Props | "ref"> & {
			innerRef?: RefFromAs<As>;
		}
) => JSX.Element | null;

const Dynamic = <As extends ElementNames | AnyComponent | string>({
	as,
	children,
	...props
}: DynamicProps<As>): JSX.Element | null => {
	if (as == null) {
		return null;
	}

	if (typeof as === "string") {
		// @ts-expect-error
		props.ref = props.innerRef;
		delete props.innerRef;
	}

	// @ts-ignore
	return h(as, props, children);
};

export default Dynamic;
