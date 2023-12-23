# Neu

> Welcome to The Neu Web.

## About

Neu is a project heavily inspired by [Cycle.js](https://cycle.js.org) and was built out of the lessons
learned from 7 years of development using [React](https://reactjs.org) in order to enable high performance,
highly scalable, and highly maintainable web applications.

## Getting Started

### Installation

~~You can install Neu using [npm](https://www.npmjs.com/package/neu).~~
An npm package is not currently available for Neu.

```sh
npm install neu
```

### Create a Neu App

```ts
import * as neu from "neu";

type Drivers = {
	dom: neu.DomDriver;
};

const app: neu.App<Drivers> = ({ dom }) => {
	return {
		dom: neu.of(neu.dom.div("Hello World!")),
	};
};

neu.run<Drivers>({
	app,
	// Assuming that an element with the id "app" exists on the page.
	dom: neu.dom.driver("#app"),
});
```

## Documentation

### App

A Neu App is a function that takes in a set of sources (supplied by drivers) and return
a set of sinks (streams).

```ts
import * as neu from "neu";

type Drivers = {
	dom: neu.DomDriver;
};

const app: neu.App<Drivers> = ({ dom }) => {
	return {
		dom: neu.of(neu.dom.div("Hello World!")),
	};
};
```

### Run

To run a Neu App, call the `run` function with the drivers needed for your application.

```ts
import * as neu from "neu";

type Drivers = {
	dom: neu.DomDriver;
};

neu.run<Drivers>({
	app,
	// For example, if your application uses the DOM, then you will
	// want to use the dom driver.
	dom: neu.dom.driver("#app"),
});
```

### Drivers

Drivers provide much of the functionality for Neu applications. Things like DOM interaction,
state, etc. are all handled by drivers. A driver is a function that takes in a stream and
returns a set of helpers. The streamed data comes directly from the Neu App's returned sinks and
the helpers are provided directly to the Neu App as a source.

```ts
import * as neu from "neu";

type MyData = number;
type MyError = unknown;
type MyHelpers = {};

export const driver: neu.Driver<MyData, MyError, MyHelpers> = (source) => {
	// Use `source` in some way...

	// Return a set of helpers.
	return {};
};
```
