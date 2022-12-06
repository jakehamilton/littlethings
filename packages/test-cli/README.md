# @littlethings/test

> A barebones zeroconf testing library

## Installation

```sh
$ npm install @littlethings/test
```

## Usage

```sh
$ npx littletest
```

By default, it will run any js/jsx/mjs/ts/tsx file with a name like `something.spec.js` or `something.test.js`.

To instead run a specific list of files, pass them as command-line arguments:

```sh
$ npx littletest my-test.js ./somewhere/my-other-test.ts ./something/a-third-test.jsx
```

For more info, run `npx littletest --help`.
