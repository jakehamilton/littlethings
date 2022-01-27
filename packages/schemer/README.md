# LittleSchemer

> Generate TypeScript code from a JSON Schema.

## Installation

```shell
# With npm
npm install --save @littlethings/schemer

# With yarn
yarn add @littlethings/schemer
```

## Usage

LittleSchemer is a tool for generating TypeScript
from a JSON Schema. Here is an example of using
LittleSchemer.

```ts
import Schemer from "@littlethings/schemer";

// Create a new instance of Schemer.
const schemer = new Schemer();

// Emit a type from a schema.
schemer.emit("MyType", {
	properties: {
		name: {
			type: "string",
		},
	},
});

const code = schemer.render();

console.log(code);
```

<details>
<summary>See Output</summary>

```js
export interface MyType {
	readonly name?: string;
}

export const serializeMyType = (options: MyType | undefined) => {
	if (options === undefined) return undefined;
	const result = {
		"name": options.name,
	};
	return result;
};
```

</details>

### Constructor

The `Schemer` constructor takes an options
argument.

```ts
export interface SchemerOptions {
	schemas?: {
		[key: string]: JSONSchema4;
	};
	serializers?: Partial<Serializers>;
	generators?: Partial<Generators>;
}
```

The `schemas` option allows you to provide schemas
that can be referenced when emitting types.

```ts
const schemer = new Schemer({
	schemas: {
		MyType: {
			properties: {
				name: {
					type: string,
				},
			},
		},
	},
});

schemer.emit("MyType");
```

The `Serializers` and `Generators` are optional
renderers used when generating code. A serializer
is used when converting a runtime value to its JSON
representation. A generator is used when writing the
code for a given type.

```ts
export type Serialize = (identifier: string) => string;

export interface Serializers {
	name: Serialize;
	union: Serialize;
	date: Serialize;
	enum: Serialize;
	struct: (name: string) => Serialize;
	array: (type: Type) => Serialize;
	map: (type: Type) => Serialize;
}
```

```ts
export interface Generators {
	union: (options: UnionGeneratorOptions) => void;
	enum: (options: EnumGeneratorOptions) => void;
	struct: (options: StructGeneratorOptions) => void;
	pattern: (options: PatternGeneratorOptions) => void;
}
```

### `schemer.render`

Render out the currently emitted types as
TypeScript.

```ts
import Schemer from "@littlethings/schemer";

const schemer = new Schemer();

schemer.emit("MyType", {
	properties: {
		name: {
			type: "string",
		},
	},
});

const code = schemer.render();

console.log(code);
```

<details>
<summary>See Output</summary>

```js
export interface MyType {
	readonly name?: string;
}

export const serializeMyType = (options: MyType | undefined) => {
	if (options === undefined) return undefined;
	const result = {
		"name": options.name,
	};
	return result;
};
```

</details>

### `schemer.define`

Add a new schema after instantiation. This
method overrides schemas that were set with
the same name.

```ts
const schemer = new Schemer({
	schemas: {
		MyType: {
			/* ... */
		},
	},
});

// Overrides the previous definition of `MyType`.
schemer.define("MyType", {
	/* ... */
});

// Overrides the previous definition of `MyType` _again_.
schemer.define("MyType", {
	/* ... */
});
```

### `schemer.alias`

Alias one name to another. This is shorthand for
calling `schemer.define` with a schema that has
`$ref` set.

```ts
const schemer = new Schemer({
	schemas: {
		MyType: {
			/* ... */
		},
	},
});

// Aliases `MyOtherType` to be the same schema as `MyType`.
schemer.alias("MyOtherType", "MyType");
```

### `schemer.emit`

This method sets the types that will be rendered out
when using `schemer.render`.

#### `schemer.emit(name, schema)`

Emitting a type using a schema is straight-forward.
Pass the name and schema to `schemer.emit` and you're
done!

```ts
import Schemer from "@littlethings/schemer";

const schemer = new Schemer();

schemer.emit("MyType", {
	properties: {
		name: {
			type: "string",
		},
	},
});

const code = schemer.render();

console.log(code);
```

<details>
<summary>See Output</summary>

```js
export interface MyType {
	readonly name?: string;
}

export const serializeMyType = (options: MyType | undefined) => {
	if (options === undefined) return undefined;
	const result = {
		"name": options.name,
	};
	return result;
};
```

</details>

#### `schemer.emit(name, emitter)`

It is also possible to emit a custom type. This means
that instead of providing a schema, you provide a
function that will render out its own code manually.

> `schemer.emit` uses [LittleCoder](https://npm.im/@littlethings/coder)
> for code generation.

```ts
const schemer = new Schemer();

schemer.emit("MyType", (coder) => {
	coder.line("export interface MyType {}");

	// Optionally return a `Type`
	const type: Type {
		type: "MyType",
		serializer: identifier => identifier,
	};
});

const code = schemer.render();

console.log(code);
```

<details>
<summary>See Output</summary>

```js
export interface MyType {}
```

</details>
