import { Signal, Sink, SinkArgs, Source } from "~/streams/interface";

export const proxy = <Data>() => {
	let buffer: Array<SinkArgs<Data, unknown, unknown>> = [];

	let downstream: Sink<Data> | null = null;

	const sink: Sink<Data> = (type, data) => {
		if (downstream) {
			if (type === Signal.Start) {
				downstream(type, data);
			} else if (type === Signal.Data) {
				downstream(type, data);
			} else if (type === Signal.End) {
				downstream(type, data);
			}
		} else {
			buffer.push([type, data] as SinkArgs<Data, unknown, unknown>);
		}
	};

	const source: Source<Data> = (type, data) => {
		if (type === Signal.Start) {
			downstream = data;

			if (buffer.length > 0) {
				for (const [t, d] of buffer.slice()) {
					if (t === Signal.Start) {
						downstream(t, d);
					} else if (t === Signal.Data) {
						downstream(t, d);
					} else if (t === Signal.End) {
						downstream(t, d);
					}
				}

				buffer = [];
			}
		}
	};

	return {
		sink,
		source,
	};
};
