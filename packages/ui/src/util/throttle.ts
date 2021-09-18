const throttle = <Callback extends (...args: any[]) => any>(
	callback: Callback,
	duration: number
) => {
	let timeout: ReturnType<typeof setTimeout> | null = null;
	let last = 0;

	const handler = (...args: Parameters<Callback>): void => {
		const now = Date.now();

		const remaining = duration - (now - last);

		if (timeout) {
			clearTimeout(timeout);
			timeout = null;
		}

		if (remaining <= 0 || remaining > duration) {
			last = now;
			callback(...args);
		} else {
			timeout = setTimeout(callback, remaining, ...args);
		}
	};

	return handler;
};

export default throttle;
