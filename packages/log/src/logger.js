// @ts-check
const kleur = require("kleur");

const util = require("./util");

/**
 * @typedef {import('./config')} Config
 */

/**
 * @typedef {keyof Config['LEVEL_TO_NUMBER']} LogLevelName
 */

/**
 * @typedef {keyof Config['NUMBER_TO_LEVEL']} LogLevelNumber
 */

/**
 * Whether or not to display log prefixes.
 */
const NO_PREFIX = process.env.LOG_PREFIX === "false";

/**
 * Whether or not to log timestamps.
 */
const TIMESTAMP = process.env.LOG_TIMESTAMP === "true";

/**
 * Whether or not the `DEBUG` environment variable has been set.
 */
const HAS_DEBUG = Boolean(process.env.DEBUG);

/**
 * A `RegExp` created from the `DEBUG` environment variable.
 */
const DEBUG = HAS_DEBUG ? new RegExp(process.env.DEBUG) : null;

/**
 * Returns the timestamp portion of the log message if enabled.
 * @returns {string}
 */
const getTimestamp = () => {
    if (TIMESTAMP) {
        return `${kleur.dim(new Date().toISOString())} `;
    } else {
        return "";
    }
};

/**
 * Get the prefix for a log.
 *
 * @param {LogLevelName | 'WARN' | 'ERROR' | 'FATAL'} name
 * @returns {string} prefix
 */
const getLogPrefix = (name, prefix) => {
    if (NO_PREFIX) {
        return "";
    }

    const userPrefix = prefix ? `[${prefix}]` : "";

    const timestamp = getTimestamp();

    switch (name) {
        case "SILENT":
            if (userPrefix === "") {
                return "";
            } else {
                return `${timestamp}${kleur.bold().white(userPrefix)}`;
            }
        case "INFO":
            return `${timestamp}${kleur.bold().blue(`${userPrefix}[INFO]`)} `;
        case "WARN":
            return `${timestamp}${kleur.bold().yellow(`${userPrefix}[WARN]`)} `;
        case "DEBUG":
            return `${timestamp}${kleur
                .bold()
                .magenta(`${userPrefix}[DEBUG]`)} `;
        case "TRACE":
            return `${timestamp}${kleur.bold().dim(`${userPrefix}[TRACE]`)} `;
        case "ERROR":
            return `${timestamp}${kleur.bold().red(`${userPrefix}[ERROR]`)} `;
        case "FATAL":
            return `${timestamp}${kleur
                .bold()
                .bgRed()
                .white(`${userPrefix}[FATAL]`)} `;
    }
};

/**
 * Get the verbosity for a log level.
 * @param {LogLevelName} name
 * @returns {LogLevelNumber}
 */
const getVerbosity = util.getNumberFromLevel;

/**
 * @type {LogLevelNumber}
 */
let verbosity;

if (process && process.env) {
    // Expecting node environment.
    // @ts-ignore
    verbosity = util.getNumberFromLevel(
        process.env.LOG_LEVEL ? process.env.LOG_LEVEL.toUpperCase() : "INFO"
    );
} else if (window) {
    // Expecting browser environment.
    // @ts-ignore
    verbosity = util.getNumberFromLevel(window.LOG_LEVEL.toUpperCase());
}

/**
 * Create an info logger for a log level.
 *
 * @param {LogLevelName} name
 * @returns {void}
 */
const setVerbosity = (name) => {
    verbosity = util.getNumberFromLevel(name);
    process.env.LOG_LEVEL = name;
};

/**
 * Render a message with rich formatting.
 * @param {string} message
 * @param {boolean} [wrap]
 */
const getLogMessage = (message, wrap = false) => {
    if (message === undefined) {
        return "undefined";
    } else if (message === null) {
        return "null";
    } else if (Array.isArray(message)) {
        const output = message.map((item) => {
            return getLogMessage(item, true);
        });

        return output.join(kleur.white(","));
    } else if (typeof message === "object") {
        let output = [];

        for (const key of Object.keys(message)) {
            output.push(
                `${kleur.bold().white(`${key}=`)}${kleur.gray(
                    getLogMessage(message[key], true)
                )}`
            );
        }

        if (wrap) {
            return `${kleur.bold().white("{")} ${output.join(
                " "
            )} ${kleur.bold().white("}")}`;
        } else {
            return output.join(" ");
        }
    } else {
        return message;
    }
};

/**
 * Create an info logger for a log level.
 *
 * @param {LogLevelName} name
 */
const logger = (name, prefix = "") => {
    const level = util.getNumberFromLevel(name);

    /**
     * Log a message to stdout.
     *
     * @param {string} message
     */
    const logger = (message) => {
        if (verbosity >= level) {
            if (HAS_DEBUG && (prefix === "" || DEBUG.exec(prefix) === null)) {
                return;
            }

            process.stdout.write(
                `${getLogPrefix(name, prefix)}${getLogMessage(message)}\n`
            );
        }
    };

    return logger;
};

/**
 * Create an info logger for a log level.
 *
 * @param {string} prefix
 */
const warnLogger = (prefix = "") => {
    /**
     * Log a message to stdout.
     *
     * @param {string} message
     */
    const logger = (message) => {
        if (HAS_DEBUG && (prefix === "" || DEBUG.exec(prefix) === null)) {
            return;
        }

        process.stdout.write(
            `${getLogPrefix("WARN", prefix)}${getLogMessage(message)}\n`
        );
    };

    return logger;
};

/**
 * Create an info logger for a log level.
 *
 * @param {string} prefix
 */
const errorLogger = (prefix = "") => {
    /**
     * Log a message to stdout.
     *
     * @param {string} message
     */
    const logger = (message) => {
        if (HAS_DEBUG && (prefix === "" || DEBUG.exec(prefix) === null)) {
            return;
        }

        process.stderr.write(
            `${getLogPrefix("ERROR", prefix)}${getLogMessage(message)}\n`
        );
    };

    return logger;
};

/**
 * Create an info logger for a log level.
 *
 * @param {string} prefix
 */
const fatalLogger = (prefix = "") => {
    /**
     * Log a message to stdout.
     *
     * @param {string} message
     */
    const logger = (message) => {
        if (HAS_DEBUG && (prefix === "" || DEBUG.exec(prefix) === null)) {
            return;
        }

        process.stderr.write(
            `${getLogPrefix("FATAL", prefix)}${getLogMessage(message)}\n`
        );
    };

    return logger;
};

/**
 * Create logging functions with a prefix.
 * @param {string} prefix
 */
const create = (prefix) => {
    if (typeof prefix !== "string") {
        prefix = "";
    }

    return {
        info: logger("INFO", prefix),
        debug: logger("DEBUG", prefix),
        trace: logger("TRACE", prefix),
        warn: warnLogger(prefix),
        error: errorLogger(prefix),
        fatal: fatalLogger(prefix),
        create,
        child: () => create(prefix),
    };
};

module.exports = {
    getVerbosity,
    setVerbosity,
    info: logger("INFO"),
    debug: logger("DEBUG"),
    trace: logger("TRACE"),
    warn: warnLogger(),
    error: errorLogger(),
    fatal: fatalLogger(),
    create,
    child: create,
};
