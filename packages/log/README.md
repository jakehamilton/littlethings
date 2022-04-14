<p align="center">
  <img src="https://raw.githubusercontent.com/jakehamilton/littlethings/main/packages/log/assets/littlelog.png" width="400">
</p>

# LittleLog

> A simple logging utility.

## Preview

<img src="https://raw.githubusercontent.com/jakehamilton/littlethings/main/packages/log/assets/preview.png">

## Installation

Install using your favorite package manager:

```bash
npm install @littlethings/log
```

## Usage

### Configuration

#### Programmatic

To configure LittleLog using the `configure` function, see the following example.#

```ts
import { configure, LogLevel } from "littlelog";

configure({
	/**
	 * How verbose the logging should be.
	 * Defaults to `process.env.LOG_LEVEL`.
	 */
	level: LogLevel.Info,
	/**
	 * An optional filter used to filter logs based on prefix.
	 * Defaults to `undefined`.
	 */
	filter: "my-prefix",
	/**
	 * Whether or not to log prefixes before messages.
	 * Defaults to `true`.
	 */
	prefix: false,
	/**
	 * Whether or not to log timestamps.
	 * Defaults to `true`.
	 */
	timestamp: false,
	/**
	 * Whether or not to enable color logging.
	 * Defaults to `true` if in a TTY, otherwise defaults to `false`.
	 */
	color: false,
	/**
	 * Whether or not to enable icons in logs.
	 * Defaults to `false`.
	 */
	icons: true,
});
```

#### Environment Variables

Default values can be supplied via the environment, but they may be
overriden by programmatic configuration as seen above.

```shell
# Set the log level (options are: SILENT, INFO, DEBUG, TRACE).
LOG_LEVEL=INFO

# Don't log prefixes.
LOG_PREFIX=false

# Enable timestamps.
LOG_TIMESTAMP=true

# Filter logs based on prefix regex.
LOG_FILTER="^my-app$"
# You can use the more common `DEBUG` variable for filtering if you prefer.
#DEBUG="^my-app$"

# Enable color.
LOG_COLOR=true

# Disable color.
LOG_COLOR=false

# Or, for compatibility with Chalk, you can use `FORCE_COLOR`.
FORCE_COLOR=1
FORCE_COLOR=0

# Enable icons.
LOG_ICONS=true
```

### Logging

To log messages using the base logger, see the following example.

```ts
import log from "littlelog";

log.info("This is an info log.");

log.debug("This is a debug log.");

log.trace("This is a trace log.");

log.warn("This is a warn log.");

log.error("This is an error log.");

log.fatal("This is a fatal log.");
```

To create a child logger with a unique prefix, see the following example.

```ts
import littlelog from "littlelog";

// This will have the prefix `MyLogger`.
const myLogger = littlelog.child("MyLogger");

myLogger.info("This is an info log.");

myLogger.debug("This is a debug log.");

myLogger.trace("This is a trace log.");

myLogger.warn("This is a warn log.");

myLogger.error("This is an error log.");

myLogger.fatal("This is a fatal log.");

// You can continue to create child loggers if you want!
// This will have the prefix `MyLogger:MySubLogger`.
const mySubLogger = littlelog.child("MySubLogger");

mySubLogger.info("This is an info log.");

mySubLogger.debug("This is a debug log.");

mySubLogger.trace("This is a trace log.");

mySubLogger.warn("This is a warn log.");

mySubLogger.error("This is an error log.");

mySubLogger.fatal("This is a fatal log.");
```
