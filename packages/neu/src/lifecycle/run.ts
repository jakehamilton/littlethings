import { Signal, Source } from "~/streams/interface";
import { proxy } from "~/streams/util/proxy";

export type Driver<Value, Error, Return> = (
	source: Source<Value, Error, any>,
) => Return;

export type AnyDriver = Driver<any, any, any>;

export type AnyDrivers = {
	[key: string]: AnyDriver;
};

export type AppSinks = {
	[key: string]: Source<any>;
};

export type App<
	Drivers extends AnyDrivers,
	Sinks extends AppSinks = {},
	Props extends Record<string, any> = never,
> = [Props] extends [never]
	? (
			sources: {
				[key in keyof Drivers]: Drivers[key] extends Driver<
					any,
					any,
					infer Return
				>
					? Return
					: ReturnType<Drivers[key]>;
			},
	  ) => {
			[key in keyof Drivers]?: Drivers[key] extends Driver<
				infer Value,
				infer Error,
				any
			>
				? Source<Value, Error, any>
				: Source<any, any>;
	  } &
			Sinks
	: (
			sources: {
				[key in keyof Drivers]: Drivers[key] extends Driver<
					any,
					any,
					infer Return
				>
					? Return
					: ReturnType<Drivers[key]>;
			},
			props: Props,
	  ) => {
			[key in keyof Drivers]?: Drivers[key] extends Driver<
				infer Value,
				infer Error,
				any
			>
				? Source<Value, Error, any>
				: Source<any, any>;
	  } &
			Sinks;

export function run<
	Drivers extends AnyDrivers,
	Sinks extends AppSinks = {},
	Props extends Record<string, any> | never = never,
>(
	...args: [Props] extends [never]
		? [sources: { app: App<Drivers, Sinks, Props> } & Drivers]
		: [sources: { app: App<Drivers, Sinks, Props> } & Drivers, props: Props]
) {
	const [{ app, ...rest }, props] = args;

	const proxies = {};
	const drivers = {};

	for (const key in rest) {
		// @ts-expect-error
		proxies[key] = proxy();
		// @ts-expect-error
		drivers[key] = rest[key](proxies[key].source);
	}

	// @ts-expect-error
	const sources = app(drivers, props);

	for (const key in rest) {
		// @ts-expect-error
		sources[key]?.(Signal.Start, proxies[key].sink);
	}
}
