import {
	Source,
	Transformer,
	UnwrapSource,
	UnwrapTransformer,
} from "~/streams/interface";

export function pipe<S extends Source<any, any, any>>(source: S): S;
export function pipe<
	S extends Source<any, any, any>,
	T1 extends Transformer<UnwrapSource<S>, any>,
>(source: S, t1: T1): ReturnType<T1>;
export function pipe<
	S extends Source<any, any, any>,
	T1 extends Transformer<UnwrapSource<S>, any>,
	T2 extends Transformer<UnwrapTransformer<T1>["output"], any>,
>(source: S, t1: T1, t2: T2): ReturnType<T2>;
export function pipe<
	S extends Source<any, any, any>,
	T1 extends Transformer<UnwrapSource<S>, any>,
	T2 extends Transformer<UnwrapTransformer<T1>["output"], any>,
	T3 extends Transformer<UnwrapTransformer<T2>["output"], any>,
>(source: S, t1: T1, t2: T2, t3: T3): ReturnType<T3>;
export function pipe<
	S extends Source<any, any, any>,
	T1 extends Transformer<UnwrapSource<S>, any>,
	T2 extends Transformer<UnwrapTransformer<T1>["output"], any>,
	T3 extends Transformer<UnwrapTransformer<T2>["output"], any>,
	T4 extends Transformer<UnwrapTransformer<T3>["output"], any>,
>(source: S, t1: T1, t2: T2, t3: T3, t4: T4): ReturnType<T4>;
export function pipe<
	S extends Source<any, any, any>,
	T1 extends Transformer<UnwrapSource<S>, any>,
	T2 extends Transformer<UnwrapTransformer<T1>["output"], any>,
	T3 extends Transformer<UnwrapTransformer<T2>["output"], any>,
	T4 extends Transformer<UnwrapTransformer<T3>["output"], any>,
	T5 extends Transformer<UnwrapTransformer<T4>["output"], any>,
>(source: S, t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): ReturnType<T5>;
export function pipe<
	S extends Source<any, any, any>,
	T1 extends Transformer<UnwrapSource<S>, any>,
	T2 extends Transformer<UnwrapTransformer<T1>["output"], any>,
	T3 extends Transformer<UnwrapTransformer<T2>["output"], any>,
	T4 extends Transformer<UnwrapTransformer<T3>["output"], any>,
	T5 extends Transformer<UnwrapTransformer<T4>["output"], any>,
	T6 extends Transformer<UnwrapTransformer<T5>["output"], any>,
>(source: S, t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6): ReturnType<T6>;
export function pipe<
	S extends Source<any, any, any>,
	T1 extends Transformer<UnwrapSource<S>, any>,
	T2 extends Transformer<UnwrapTransformer<T1>["output"], any>,
	T3 extends Transformer<UnwrapTransformer<T2>["output"], any>,
	T4 extends Transformer<UnwrapTransformer<T3>["output"], any>,
	T5 extends Transformer<UnwrapTransformer<T4>["output"], any>,
	T6 extends Transformer<UnwrapTransformer<T5>["output"], any>,
	T7 extends Transformer<UnwrapTransformer<T6>["output"], any>,
>(
	source: S,
	t1: T1,
	t2: T2,
	t3: T3,
	t4: T4,
	t5: T5,
	t6: T6,
	t7: T7,
): ReturnType<T7>;
export function pipe<
	S extends Source<any, any, any>,
	T1 extends Transformer<UnwrapSource<S>, any>,
	T2 extends Transformer<UnwrapTransformer<T1>["output"], any>,
	T3 extends Transformer<UnwrapTransformer<T2>["output"], any>,
	T4 extends Transformer<UnwrapTransformer<T3>["output"], any>,
	T5 extends Transformer<UnwrapTransformer<T4>["output"], any>,
	T6 extends Transformer<UnwrapTransformer<T5>["output"], any>,
	T7 extends Transformer<UnwrapTransformer<T6>["output"], any>,
	T8 extends Transformer<UnwrapTransformer<T7>["output"], any>,
>(
	source: S,
	t1: T1,
	t2: T2,
	t3: T3,
	t4: T4,
	t5: T5,
	t6: T6,
	t7: T7,
	t8: T8,
): ReturnType<T8>;
export function pipe<
	S extends Source<any, any, any>,
	T1 extends Transformer<UnwrapSource<S>, any>,
	T2 extends Transformer<UnwrapTransformer<T1>["output"], any>,
	T3 extends Transformer<UnwrapTransformer<T2>["output"], any>,
	T4 extends Transformer<UnwrapTransformer<T3>["output"], any>,
	T5 extends Transformer<UnwrapTransformer<T4>["output"], any>,
	T6 extends Transformer<UnwrapTransformer<T5>["output"], any>,
	T7 extends Transformer<UnwrapTransformer<T6>["output"], any>,
	T8 extends Transformer<UnwrapTransformer<T7>["output"], any>,
	T9 extends Transformer<UnwrapTransformer<T8>["output"], any>,
>(
	source: S,
	t1: T1,
	t2: T2,
	t3: T3,
	t4: T4,
	t5: T5,
	t6: T6,
	t7: T7,
	t8: T8,
	t9: T9,
): ReturnType<T9>;
export function pipe<
	S extends Source<any, any, any>,
	T1 extends Transformer<UnwrapSource<S>, any>,
	T2 extends Transformer<UnwrapTransformer<T1>["output"], any>,
	T3 extends Transformer<UnwrapTransformer<T2>["output"], any>,
	T4 extends Transformer<UnwrapTransformer<T3>["output"], any>,
	T5 extends Transformer<UnwrapTransformer<T4>["output"], any>,
	T6 extends Transformer<UnwrapTransformer<T5>["output"], any>,
	T7 extends Transformer<UnwrapTransformer<T6>["output"], any>,
	T8 extends Transformer<UnwrapTransformer<T7>["output"], any>,
	T9 extends Transformer<UnwrapTransformer<T8>["output"], any>,
	T10 extends Transformer<UnwrapTransformer<T9>["output"], any>,
>(
	source: S,
	t1: T1,
	t2: T2,
	t3: T3,
	t4: T4,
	t5: T5,
	t6: T6,
	t7: T7,
	t8: T8,
	t9: T9,
	t10: T10,
): ReturnType<T10>;

export function pipe<S extends Source<any, any, any>>(
	source: S,
	...transformers: Array<Transformer<any, any>>
): Source<any, any, any> {
	let result: Source<any, any, any> = source;

	for (const transformer of transformers) {
		result = transformer(result);
	}

	return result;
}
