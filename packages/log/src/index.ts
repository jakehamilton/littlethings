import kleur, { Color } from "kleur";

/**
 * Log levels that can be set with `configure`.
 */
export enum LogLevel {
	Silent = "SILENT",
	Info = "INFO",
	Debug = "DEBUG",
	Trace = "TRACE",
}

enum LogKind {
	Info = "INFO",
	Warn = "WARN",
	Debug = "DEBUG",
	Trace = "TRACE",
	Error = "ERROR",
	Fatal = "FATAL",
}

const stdout = process.stdout.write.bind(process.stdout);
const stderr = process.stderr.write.bind(process.stderr);

const kind = {
	colors: {
		[LogKind.Info]: kleur.bold().blue,
		[LogKind.Warn]: kleur.bold().yellow,
		[LogKind.Debug]: kleur.bold().magenta,
		[LogKind.Trace]: kleur.bold().dim,
		[LogKind.Error]: kleur.bold().red,
		[LogKind.Fatal]: kleur.bold().bgWhite().red,
	},
	icons: {
		[LogKind.Info]: "",
		[LogKind.Warn]: "",
		[LogKind.Debug]: "",
		[LogKind.Trace]: "﯎",
		[LogKind.Error]: "",
		[LogKind.Fatal]: "ﮊ",
	},
	loggers: {
		[LogKind.Info]: stdout,
		[LogKind.Warn]: stdout,
		[LogKind.Debug]: stdout,
		[LogKind.Trace]: stdout,
		[LogKind.Error]: stderr,
		[LogKind.Fatal]: stderr,
	},
	levels: {
		[LogKind.Info]: [LogLevel.Info, LogLevel.Debug, LogLevel.Trace],
		[LogKind.Warn]: [LogLevel.Info, LogLevel.Debug, LogLevel.Trace],
		[LogKind.Debug]: [LogLevel.Debug, LogLevel.Trace],
		[LogKind.Trace]: [LogLevel.Trace],
		[LogKind.Error]: [LogLevel.Info, LogLevel.Debug, LogLevel.Trace],
		[LogKind.Fatal]: [LogLevel.Info, LogLevel.Debug, LogLevel.Trace],
	},
};

const prefixes = {
	colors: [
		kleur.bold().blue,
		kleur.bold().green,
		kleur.bold().cyan,
		kleur.bold().magenta,
		kleur.bold().yellow,
		kleur.bold().white,
	],
};

const braces = {
	colors: [kleur.bold().blue, kleur.bold().magenta, kleur.bold().yellow],
};

const syntax = {
	colors: {
		undefined: kleur.dim,
		null: kleur.blue,
		number: kleur.yellow,
		string: kleur.green,
		boolean: kleur.blue,
		comma: kleur.white,
		property: kleur.white,
		equals: kleur.white,
		circular: kleur.dim,
		stack: kleur.red,
	},
};

const misc = {
	colors: {
		timestamp: kleur.dim,
	},
};

let currentPrefixColor = -1;
const prefixColorMap = new Map<Array<string>, Color>();

export interface LogConfig {
	/**
	 * How verbose the logging should be.
	 * Defaults to `process.env.LOG_LEVEL`.
	 */
	level: LogLevel;
	/**
	 * An optional filter used to filter logs based on prefix.
	 * Defaults to `undefined`.
	 */
	filter: string | RegExp | undefined;
	/**
	 * Whether or not to log prefixes before messages.
	 * Defaults to `true`.
	 */
	prefix: boolean;
	/**
	 * Whether or not to log timestamps.
	 * Defaults to `true`.
	 */
	timestamp: boolean;
	/**
	 * Whether or not to enable color logging.
	 * Defaults to `true` if in a TTY, otherwise defaults to `false`.
	 */
	color: boolean;
	/**
	 * Whether or not to enable icons in logs.
	 * Defaults to `false`.
	 */
	icons: boolean;
}

let config: LogConfig = {
	level: (process.env["LOG_LEVEL"] as LogLevel) || LogLevel.Info,
	filter: process.env["LOG_FILTER"] || process.env["DEBUG"] || undefined,
	prefix: process.env["LOG_PREFIX"] !== "false",
	timestamp: process.env["LOG_TIMESTAMP"] === "true",
	color:
		process.env["LOG_COLOR"] === "true" ||
		// `FORCE_COLOR` supports chalk-style enable/disable for compatibility.
		process.env["FORCE_COLOR"] === "1" ||
		((process.env["LOG_COLOR"] !== "false" ||
			process.env["FORCE_COLOR"] !== "0") &&
			(process.stdout.isTTY ?? false)),
	icons: process.env["LOG_ICONS"] === "true",
};

/**
 * Configure LittleLog's output.
 */
export function configure(value: Partial<LogConfig>) {
	config = { ...config, ...value };
}

/**
 * A convenience type for use with `parseLogLevelNumber`.
 */
export type LogLevelAsNumber = 0 | 1 | 2;

/**
 * Take a number and return the name of the LogLevel it corresponds to.
 */
export function parseLogLevelNumber(level: LogLevelAsNumber) {
	if (typeof level === "number") {
		switch (level) {
			default:
			case 0:
				return LogLevel.Info;
			case 1:
				return LogLevel.Debug;
			case 2:
				return LogLevel.Trace;
		}
	}
}

function color(color: Color, text: string) {
	if (config.color) {
		return color(text);
	} else {
		return text;
	}
}

function renderTimestamp() {
	return config.timestamp
		? `${color(misc.colors.timestamp, new Date().toISOString())} `
		: "";
}

function renderIcon(name: LogKind) {
	return config.icons ? `${kind.icons[name]}  ` : "";
}

function renderKind(name: LogKind, icon: string) {
	return color(kind.colors[name], ` ${icon}${name.padEnd(5, " ")} `);
}

function renderPrefix(prefix: Array<string>) {
	if (prefix.length > 0 && !prefixColorMap.has(prefix)) {
		currentPrefixColor++;

		if (currentPrefixColor >= prefixes.colors.length) {
			currentPrefixColor = 0;
		}

		prefixColorMap.set(prefix, prefixes.colors[currentPrefixColor]);
	}

	return prefix.length > 0
		? `${color(prefixColorMap.get(prefix)!, prefix.join(":"))} `
		: "";
}

function escapeString(string: string) {
	return string.replaceAll('"', '\\"');
}

function renderMessage(message: any, depth = 0, known = new Set()): string {
	const type = typeof message;

	if (known.has(message)) {
		return syntax.colors.circular("[Circular Reference]");
	} else {
		known.add(message);
	}

	if (depth > 200) {
		return syntax.colors.stack("[Stack Size Exceeded]");
	}

	if (type === "undefined") {
		return syntax.colors.undefined("undefined");
	} else if (message === null) {
		return syntax.colors.null("null");
	} else if (type === "number") {
		return syntax.colors.number(message.toString());
	} else if (type === "boolean") {
		return syntax.colors.boolean(message.toString());
	} else if (type === "string") {
		return syntax.colors.string(`"${escapeString(message)}"`);
	} else if (Array.isArray(message)) {
		const content = message
			.map((item) => renderMessage(item, depth + 1, new Set([...known])))
			.join(syntax.colors.comma(", "));

		const index = depth % braces.colors.length;

		const openBrace = color(braces.colors[index], "[");
		const closeBrace = color(braces.colors[index], "]");

		return `${openBrace} ${content} ${closeBrace}`;
	} else if (type === "object") {
		const pairs = [];

		for (const [key, value] of Object.entries(message)) {
			const hasUnsupportedChars = key.match(/[^[a-zA-Z_\$]/g);
			const renderedKey = hasUnsupportedChars
				? syntax.colors.string(`"${escapeString(key)}"`)
				: syntax.colors.property(key);
			const renderedValue = renderMessage(
				value,
				depth + 1,
				new Set([...known])
			);

			pairs.push(
				`${renderedKey}${syntax.colors.equals("=")}${renderedValue}`
			);
		}

		const content = pairs.join(" ");

		const index = depth % braces.colors.length;

		const openBrace = color(braces.colors[index], "{");
		const closeBrace = color(braces.colors[index], "}");

		return `${openBrace} ${content} ${closeBrace}`;
	} else {
		return message;
	}
}

function renderMessages(messages: Array<any>) {
	if (messages.length === 1 && typeof messages[0] === "string") {
		return messages[0];
	} else {
		return messages.map((message) => renderMessage(message, 0)).join(" ");
	}
}

function render(name: LogKind, prefix: Array<string>, ...messages: Array<any>) {
	return `${renderTimestamp()}${renderKind(
		name,
		renderIcon(name)
	)} ${renderPrefix(prefix)}${renderMessages(messages)}\n`;
}

class LittleLog {
	prefix: Array<string>;

	constructor(prefix: Array<string>) {
		this.prefix = prefix;
	}

	static create(prefix?: string) {
		return new LittleLog(prefix ? [prefix] : []);
	}

	child(prefix: string) {
		return new LittleLog([...this.prefix, prefix]);
	}

	private log(name: LogKind, ...message: Array<any>) {
		if (kind.levels[name].includes(config.level)) {
			kind.loggers[name](render(name, this.prefix, ...message));
		}
	}

	info = this.log.bind(this, LogKind.Info);
	warn = this.log.bind(this, LogKind.Warn);
	debug = this.log.bind(this, LogKind.Debug);
	trace = this.log.bind(this, LogKind.Trace);
	error = this.log.bind(this, LogKind.Error);
	fatal = this.log.bind(this, LogKind.Fatal);
}

export default LittleLog.create();
