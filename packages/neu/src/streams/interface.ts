// Adapted from: https://github.com/tim-smart/strict-callbag/blob/main/index.ts
/**
 * A `Signal` is used for communication between producers and consumers.
 *
 * - `START` is used during the handshake phase
 * - `DATA` is used to request or send data
 * - `END` indicates if the producer / consumer has finished, or has aborted
 */
export enum Signal {
	Start = 0,
	Data = 1,
	End = 2,
}

/**
 * A `Talkback` is sent from a sink to a producer to:
 *
 * - Request more data
 * - Abort the stream, optionally with an error
 */
export type Talkback<E = unknown> = (
	signal: Signal.Data | Signal.End,
	error?: E | undefined,
) => void;

export type SinkArgs<A, EI, EO> =
	| [signal: Signal.Start, talkback: Talkback<EO>]
	| [signal: Signal.Data, data: A]
	| [signal: Signal.End, error: EI | undefined];

/**
 * A `Sink` consumes data from a producer.
 *
 * - It can recieve data of the `A` type
 * - It can recieve errors of the `EI` type
 * - It can abort with errors of the `EO` type
 */
export type Sink<A, EI = unknown, EO = unknown> = (
	...op: SinkArgs<A, EI, EO>
) => void;

export type SourceArgs<A, EI, EO> =
	| [signal: Signal.Start, sink: Sink<A, EI, EO>]
	| [signal: Signal.End, error: EI | undefined];

/**
 * A `Source` produces data
 *
 * - It can send data of the `A` type
 * - It can send errors of the `E` type
 */
export type Source<A, EI = unknown, EO = unknown> = (
	...op: SourceArgs<A, EI, EO>
) => void;

export type Stream<A, EI = unknown, EO = unknown> = Source<A, EI, EO>;

export type Transformer<Input, Output, Error = unknown> = (
	input: Source<Input, Error>,
) => Source<Output, Error>;

export type Operator<Input, Output, Params extends Array<any> = Array<any>> = (
	...args: Params
) => Transformer<Input, Output>;

export type UnwrapSource<T extends Source<any>> = T extends Source<infer Data>
	? Data
	: never;
export type UnwrapSink<T extends Sink<any>> = T extends Sink<infer Data>
	? Data
	: never;
export type UnwrapTransformer<T extends Transformer<any, any, any>> =
	T extends Transformer<infer Input, infer Output, infer _Error>
		? { input: Input; output: Output }
		: never;
