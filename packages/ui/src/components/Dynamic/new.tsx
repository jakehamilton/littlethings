import { AnyComponent, FunctionComponent, VNode } from "preact";
import { JSXInternal } from "preact/src/jsx";

type Error<Message extends string> = { readonly __message: Message };

type At<Arr extends Array<unknown>, N extends number> = Arr extends Record<
	N,
	infer T
>
	? T
	: never;

type Replace<Arr extends Array<unknown>, T> = Arr extends [
	infer X,
	...infer Rest
]
	? [T, ...Replace<Rest, T>]
	: [];

type Zip<
	ArrX extends Array<unknown>,
	ArrY extends Array<unknown>
> = ArrX extends [infer X, ...infer RestX]
	? ArrY extends [infer Y, ...infer RestY]
		? [[X, Y], ...Zip<RestX, RestY>]
		: Error<"Zip: Expected arrays to be the same length.">
	: [];

type Elements = JSXInternal.IntrinsicElements;

type ElementNames = keyof Elements;

type KnownElement = ElementNames | FunctionComponent<any>;

type DynamicAs = KnownElement;

type PropsObject = object;

type ExtendedPropsShape = {
	as: DynamicAs;
	key: string;
	props: PropsObject;
	required?: boolean;
};

type ExtendedUnit = [DynamicAs, ExtendedPropsShape];

type DynamicProps<As extends DynamicAs, Props extends PropsObject> = {
	as?: As;
} & Props &
	Omit<
		As extends ElementNames
			? Elements[As]
			: As extends FunctionComponent<infer ComponentProps>
			? ComponentProps
			: Record<string, any>,
		keyof Props
	>;

type GetExtendedProps<Unit extends ExtendedUnit> = Unit extends [
	infer As,
	infer Props
]
	? Props extends ExtendedPropsShape
		? As extends DynamicAs
			? Props["required"] extends true
				? Record<Props["key"], DynamicProps<As, Props["props"]>>
				: Partial<
						Record<
							Props["key"],
							DynamicProps<As, Props["props"]> | undefined
						>
				  >
			: Error<"GetExtendedProps: Expected [DynamicAs, ExtendedPropsShape].">
		: Error<"GetExtendedProps: Expected [DynamicAs, ExtendedPropsShape].">
	: Error<"GetExtendedProps: Could not infer Props from [As, ExtendedPropsShape].">;

type MergeExtendedProps<Args extends Array<ExtendedUnit> = []> = Args extends [
	infer Unit
]
	? Unit extends ExtendedUnit
		? GetExtendedProps<Unit>
		: Error<"MergeExtendedProps: Expected [As, ExtendedPropsShape].">
	: Args extends [infer Unit, ...infer Rest]
	? Unit extends ExtendedUnit
		? Rest extends Array<ExtendedUnit>
			? GetExtendedProps<Unit> & MergeExtendedProps<Rest>
			: Error<"MergeExtendedProps: Expected Array<ExtendedUnit>.">
		: Error<"MergeExtendedProps: Expected [As, ExtendedPropsShape].">
	: {};

type MergeProps<
	As extends DynamicAs,
	Props extends PropsObject,
	ExtendedProps extends Array<ExtendedPropsShape> = [],
	ExtendedAs extends Array<DynamicAs> = []
> = DynamicProps<As, Props> &
	MergeExtendedProps<Zip<ExtendedAs, ExtendedProps>>;

type DynamicComponent<
	DefaultAs extends DynamicAs,
	Props extends PropsObject,
	ExtendedProps extends Array<ExtendedPropsShape> = []
> = <
	As extends DynamicAs = DefaultAs,
	ExtendedAs extends Replace<ExtendedProps, DynamicAs> = Replace<
		ExtendedProps,
		DynamicAs
	>
>(
	props: MergeProps<As, Props, ExtendedProps, ExtendedAs>
) => VNode<MergeProps<As, Props, ExtendedProps, ExtendedAs>>;

const Dynamic = <As extends DynamicAs>(
	props: {
		as: As;
	} & As extends ElementNames
		? As extends keyof Elements
			? Elements[As]
			: Error<"Dynamic: Expected As to extend keyof Elements.">
		: As extends AnyComponent<infer ComponentProps, infer ComponentState>
		? ComponentProps
		: Record<string, any>
): VNode<any> => {
	const { as, children, ...rest } = props;

	// @ts-expect-error
	// TypeScript's JSX injection ensures that the JSX
	// factory is included already. Importing it again
	// would break the build. Instead, we tell TypeScript
	// to ignore the missing import for the `h` function.
	return h(props.as!, rest, children);
};

// ==============================
// 	DEMO
// ==============================

// Base component properties.
interface MyComponentProps {}

// Augments to allow props passed to dynamic children.
type MyExtendedProps = [
	{
		as: "div";
		key: "ChildProps";
		props: {
			onHeck: () => void;
		};
	}
];

// Creating a dynamic component that can use a custom
// element or component via the "as" prop. This also
// supports customizing its children via the configured
// ChildProps key in MyExtendedProps.
const MyComponent: DynamicComponent<
	"div",
	MyComponentProps,
	MyExtendedProps
> = (props) => {
	const { as = "div", ChildProps } = props;

	return (
		<Dynamic as={as}>
			<Dynamic as="div" {...ChildProps} />
		</Dynamic>
	);
};

// Render out our component with a custom element for
// the root and children. Notice that the types for
// props are correctly updated (eg. onClick is a
// handler for the specific element).
const a = (
	<MyComponent
		as="p"
		onClick={() => {}}
		ChildProps={{
			as: "a",
			onHeck: () => {},
			onClick: () => {},
		}}
	/>
);

interface MySubComponentProps {
	name?: string;
}

const MySubComponent: FunctionComponent<MySubComponentProps> = ({
	name = "World",
	children,
}) => {
	return (
		<>
			Hello, {name}! {children}
		</>
	);
};

const x: DynamicProps<typeof MySubComponent, {}> = {
	as: MySubComponent,
};

const b = (
	<MyComponent
		as={MySubComponent}
		name="Jake"
		ChildProps={{
			as: MySubComponent,
			onHeck: () => {},
		}}
	/>
);

const c = <Dynamic as="canvas" onClick={() => {}} />;

// Goal

// interface MyComponentProps {
//   x?: boolean;
// }

// const MyComponent: DynamicComponent<
//   MyComponentProps,
//   [{
//     as: "div",
//     key: "RootProps",
//     props: { root?: boolean },
//   },
//   {
//     as: "div",
//     key: "ChildProps",
//     props: { child?: boolean },
//   }]
// > = ({ RootProps, ChildProps, ...props}) => {
//   return (
//     <Dynamic {...RootProps}>
//       <Dynamic {...ChildProps}>
//         <Dynamic {...props} />
//       </Dynamic>
//     </Dynamic>
//   )
// }
