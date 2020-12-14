<p align="center">
  <img src="./assets/littlelog.png" width="400">
</p>

# LittleLog

> A simple logging utility.

## Installation

Install using your favorite package manager:

```shell
# using npm
npm install --save littlelog

# using yarn
yarn add littlelog
```

## Usage

To configure the logging verbosity (defaults to `process.env.LOG_LEVEL`):

```js
const log = require("littlelog");

/*
 * Possible values are:
 * - SILENT
 * - INFO
 * - DEBUG
 * - TRACE
 */
log.setVerbosity("INFO");
```

To log messages:

```js
const log = require("littlelog");

log.info("This is an info log.");

log.debug("This is a debug log.");

log.trace("This is a trace log.");

log.warn("This is a warn log.");

log.error("This is an error log.");
```

LittleLog can be configured using environment variables:

```shell
# Set the log level (options are: SILENT, INFO, DEBUG, TRACE)
LOG_LEVEL=INFO

# Don't log prefixes
LOG_PREFIX=false

# Enable timestamps
LOG_TIMESTAMP=true

# Filter logs based on prefix regex
DEBUG="^my-app$"
```
