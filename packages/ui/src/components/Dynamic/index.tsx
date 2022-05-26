import {
	AnyComponent,
	ComponentChildren,
	FunctionComponent,
	JSX,
	VNode,
} from "preact";
import { CommonProps } from "../..";

/**
 * A utility for failure messages when types are incorrect. This
 * lets you surface a message to the user when something goes wrong
 * in the TypeScript type system.
 *
 * @example
 * type MyType<T> = T extends string ? T : Error<"MyType: T doesn't extend string!">;
 *
 * type Result = MyType<42>; // Error<...>
 */
type Error<Message extends string> = { readonly __message: Message };

/**
 * HTML Elements we know about. Useful for getting things like
 * an Element's Props.
 */
export type Elements = JSX.IntrinsicElements;
/**
 * A convenient shorthand for `keyof Elements`.
 */
export type ElementNames = keyof Elements;

/**
 * HTML Element Attributes. These are particularly useful for getting
 * things like Ref types for elements.
 */
export type Attributes<RefType extends EventTarget = EventTarget> =
	JSX.HTMLAttributes<RefType>;

export interface CustomElements {}
export type CustomElementNames = keyof CustomElements;

export type KnownElement =
	| ElementNames
	| CustomElementNames
	| AnyComponent<any, any>;

/**
 * `DynamicAs` is the type of component or name of the element
 * being used. If you want to add new elements, extend `CustomElements`
 * with the names of your web components:
 *
 * @example
 * declare module "@littlethings/ui/components/Dynamic" {
 * 	interface MyWebComponentProps {
 * 		sayHello: boolean;
 * 	}
 *
 * 	export interface CustomElements {
 * 		"my-web-component": MyWebComponentProps;
 * 	}
 * }
 */
export type DynamicAs = KnownElement;

/**
 * Sometimes `DynamicAs` is intended to be optional. This
 * type is used for convenience in those cases.
 */
export type OptionalDynamicAs = DynamicAs | undefined;

/**
 * A utility for getting the raw props object from an element or
 * component.
 *
 * @example <caption>Get the props for an HTML Element or Custom Element.</caption>
 * type DivProps = ElementProps<"div">;
 *
 * @example <caption>Get the props for a Component.</caption>
 * // Given some component...
 * const MyComponent: FunctionComponent<{ name: string }> = () => null;
 *
 * type MyComponentProps = ElementProps<MyComponent>;
 */
export type ElementProps<As extends OptionalDynamicAs> =
	As extends AnyComponent<infer Props, infer State>
		? Props
		: As extends ElementNames
		? Elements[As]
		: As extends CustomElementNames
		? CustomElements[As]
		: Error<"ElementProps: Unknown Element Type">; //Record<string, any>;

/**
 * A utility for getting the raw props object from an element or
 * component, but with a default element/component in case the
 * provided one is `undefined`. This functions identically to
 * `ElementProps` except that it requires a second generic for
 * the default element/component type.
 */
export type ElementPropsWithDefault<
	As extends OptionalDynamicAs,
	DefaultAs extends DynamicAs
> = {
	as?: As;
} & ([As] extends [undefined] ? ElementProps<DefaultAs> : ElementProps<As>);

/**
 * A utility for getting the `Ref` type of an element or component.
 *
 * @example <caption>Get the `Ref` type for an HTML Element or Custom Element.</caption>
 * type DivRef = ElementRef<"div">;
 *
 * @example <caption>Get the `Ref` type for a Component.</caption>
 * const MyComponent: FunctionComponent<{ innerRef?:  }>
 */
export type ElementRef<As extends OptionalDynamicAs> = As extends undefined
	? // If `As` is not supplied, we don't know the type of the element.
	  unknown
	: // If `As` is the name of an element.
	As extends ElementNames
	? Elements[As] extends Attributes<infer Element>
		? // Use the ref type from that element's attributes.
		  JSX.HTMLAttributes<Element>["ref"]
		: unknown
	: // If `As` is a custom element that the user has specified.
	As extends CustomElementNames
	? CustomElementNames[As] extends { ref?: infer RefType }
		? // Use the `ref` type on its Props if available.
		  RefType
		: unknown
	: // If `As` is a component.
	As extends AnyComponent<infer Props, any>
	? // When `ref` is in props, use it.
	  Props extends { ref?: infer RefType }
		? RefType
		: // Otherwise if `innerRef` is in props, use that.
		Props extends { innerRef?: infer RefType }
		? RefType
		: unknown
	: // Otherwise, we don't know what element this is.
	  unknown;

/**
 * DynamicProps creates a Props object specific to an element
 * or component. This is useful when you want to allow
 * customization of the element you render. This is often used
 * together with `<Dynamic />`.
 *
 * @example <caption>Simple usage.</caption>
 * const MyComponent = <As extends DynamicAs>(props: DynamicProps<As>) => {
 * 	return <Dynamic {...props} />
 * }
 *
 * @example <caption>Customizing Sub-Components.</caption>
 * const MyComponent = <PrefixAs extends DynamicAs, PostfixAs extends DynamicAs>(props: {
 * 	PrefixProps: DynamicProps<PrefixAs>,
 * 	PostfixProps: DynamicProps<PostfixAs>,
 * }) => {
 * 	return (
 * 		<div>
 * 			<Dynamic {props.PrefixProps} />
 * 			<Dynamic {props.PostfixProps} />
 * 		</div>
 * 	);
 * }
 */
export type DynamicProps<As extends DynamicAs> = {
	as: As;
	innerRef?: ElementRef<As>;
} & CommonProps &
	Omit<ElementProps<As>, "as" | "innerRef">;

/**
 * This type is only used in DynamicComponent and dynamic. It was pulled
 * out to keep things readable.
 */
export type DynamicComponentProps<
	As extends OptionalDynamicAs,
	Props = {}
> = Props &
	Omit<CommonProps, keyof Props> &
	Omit<ElementProps<As>, keyof Props | "as" | "innerRef"> & {
		as: As;
		innerRef?: ElementRef<As>;
	};

/**
 * This type is only used in DynamicComponent and dynamic. It was pulled
 * out to keep things readable.
 */
export type OptionalDynamicComponentProps<
	As extends OptionalDynamicAs,
	Props = {}
> = Props &
	Omit<CommonProps, keyof Props> &
	Omit<ElementProps<As>, keyof Props | "as" | "innerRef"> & {
		as?: As;
		innerRef?: ElementRef<As>;
	};

/**
 * DynamicComponent lets you easily and quickly create a component that
 * accepts an `as` prop for customization. This is commonly used with
 * `<Dynamic />` in order to render different elements or components.
 *
 * @example
 * interface MyProps {
 * 	name: string;
 * }
 *
 * const MyComponent: DynamicComponent<"div", MyProps> = (props) => {
 * 	const { as = "div", name, ...baseProps } = props;
 *
 * 	return (
 * 		<Dynamic as={as} {...baseProps}>
 * 			{name}
 * 		</Dynamic>
 * 	);
 * }
 */
export type DynamicComponent<DefaultAs extends DynamicAs, Props = {}> = <
	As extends DynamicAs = DefaultAs
>(
	props: OptionalDynamicComponentProps<As, Props>
) => VNode<any> | null;

/**
 * Dynamic takes an `as` property and will render the given element
 * or component with the other props supplied.
 *
 * @example <caption>Render an HTML Element or Custom Element.</caption>
 * <Dynamic
 * 	as="div"
 * 	// All other properties for the given element can be applied.
 * 	onClick={(event) => {}}
 * />
 *
 * @example <caption>Render a Component.</caption>
 * interface MyProps {
 * 	onMyEvent: (event: object) => void;
 * }
 *
 * const MyComponent: FunctionComponent<MyProps> = (props) => {
 * 	// Implementation left as an exercise for the reader...
 * };
 *
 * // Render using MyComponent.
 * <Dynamic
 * 	as={MyComponent}
 * 	// All properties from the Component's Props can be used
 * 	onMyEvent={(event) => {}}
 * />
 */
export const Dynamic = <As extends DynamicAs>(
	props: DynamicProps<As>
): VNode<DynamicProps<As>> => {
	const { as, children, ...dynamicProps } = props;

	if (typeof as === "string" && dynamicProps.innerRef) {
		// @ts-expect-error
		dynamicProps.ref = dynamicProps.innerRef;
	}

	// @ts-expect-error
	return h(as, dynamicProps, children);
};

/**
 * dynamic takes a default `as` and wraps your function component to
 * enable you to dynamically render children with the use of Dynamic.
 *
 * @example <caption>Render an element or component, defaulting to a div.</caption>
 * const MyComponent = dynamic<MyProps>("div", ({ as, ...props }) => {
 * 	return <Dynamic as={as} {...props} />
 * });
 *
 * // Renders a div.
 * <MyComponent />
 *
 * // Renders a button.
 * <MyComponent as="button" />
 *
 * // Renders a component.
 * <MyComponent as={SomethingElse} />
 */
export const dynamic = <DefaultAs extends DynamicAs, Props = {}>(
	as: DefaultAs,
	Component: FunctionComponent<DynamicComponentProps<DynamicAs, Props>>
) => {
	return <As extends DynamicAs = DefaultAs>(
		props: OptionalDynamicComponentProps<As, Props>
	) => {
		if (props.as === undefined) {
			return <Component {...props} as={as} />;
		}

		return <Component {...(props as DynamicComponentProps<As, Props>)} />;
	};
};

// ==============================
// DEMO
// ==============================

// const MyComponent: DynamicComponent<"div", {}> = (props) => {
// 	const { as = "div" } = props;

// 	const x: DynamicAs = as;

// 	// @FIXME(jakehamilton): Why does this not have the correct type?
// 	return <Dynamic as={as} />;
// };

// const result = <MyComponent onClick={() => {}} />;

const MyComponent = dynamic("div", (props) => {
	const { as } = props;

	const x: DynamicAs = as;

	// @FIXME(jakehamilton): Why does this not have the correct type?
	return <Dynamic as={as} />;
});

const result = <MyComponent as="button" onClick={() => {}} />;
