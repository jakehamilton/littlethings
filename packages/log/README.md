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
const log = require('littlelog');

/*
 * Possible values are:
 * - SILENT
 * - INFO
 * - DEBUG
 * - TRACE
 */
log.setVerbosity('INFO');
```

To log messages:

```js
const log = require('littlelog');

log.info('This is an info log.');

log.debug('This is a debug log.');

log.trace('This is a trace log.');
```
