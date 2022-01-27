# LittleCoder

> A small and simple code generation tool.

## Installation

```shell
# With npm
npm install --save @littlethings/coder

# With yarn
yarn add @littlethings/coder
```

## Usage

LittleCoder is a tool that helps you generate code. It is
a simple abstraction around writing text, managing
indentation and blocks.

Here is an example of using LittleCoder.

```ts
import Coder from "@littlethings/coder";

// Create a new instance of Coder.
const coder = new Coder();

// Write a line of code
coder.line(`console.log("first line of code");`);

// Write an empty line
coder.line();

// Open a block (takes some text and appends " {")
coder.openBlock("const hello = (name) =>");

// Write some more text
coder.line("console.log(`Hello, ${name}`);");

// Close the block (*optionally* takes some text and prepends "}")
coder.closeBlock(";");

// Then take the code from the `coder.code` property
console.log(coder.code);
```

<details>
<summary>See Output</summary>

```js
console.log("first line of code");

const hello = (name) => {
	console.log(`Hello, ${name}`);
};
```

</details>

### Constructor

The `Coder` constructor takes an options
argument with two things you can customize:

-   `indentChar`: The character to use for indentation.
    Defaults to tabs (`\t`).
-   `indentAmount`: The amount of `indentChar` characters
    to print for each indent. Defaults to `1`.

These options are both optional and can be specified
together, exclusively, or not at all (to use defaults).

```ts
// Uses defaults.
new Coder();

// Will use the default `indentChar`, but print
// two of them for each indentation.
new Coder({
	indentAmount: 2,
});

// Will use spaces for indentation, printing four
// of them for each indent.
new Coder({
	indentChar: " ",
	indentAmount: 4,
});
```

### `coder.code`

This property contains the code written.

```ts
const coder = new Coder();

coder.line(`console.log("Hello, World");`);

console.log(coder.code);
```

<details>
<summary>See Output</summary>

```js
console.log("Hello, World");
```

</details>

### `coder.line`

This method writes a single line of code, ending
with `\n`.

```ts
const coder = new Coder();

coder.line(`console.log("Hello, World");`);

console.log(coder.code);
```

<details>
<summary>See Output</summary>

```js
console.log("Hello, World");
```

</details>

### `coder.openBlock`

A helper method for writing a single line, ending
in ` {\n` (note the space before the curly brace).
This method also increases the indentation level by
one so all future text is written with an indent.

```ts
const coder = new Coder();

coder.openBlock("function myFunction()");

coder.closeBlock();

console.log(coder.code);
```

<details>
<summary>See Output</summary>

<!--
	Prettier likes to format this, but we want to
	show the real output of the above example.
-->
<!-- prettier-ignore -->
```js
function myFunction() {
}
```

</details>

### `coder.closeBlock`

The complement to `coder.openBlock`. This method
reduces the indentation level, then writes a closing
curly brace (`}`) followed by an optional suffix, then
`\n`.

```ts
const coder = new Coder();

coder.openBlock("const myFunction = () =>");

coder.closeBlock(";");

console.log(coder.code);
```

<details>
<summary>See Output</summary>

<!--
	Prettier likes to format this, but we want to
	show the real output of the above example.
-->
<!-- prettier-ignore -->
```js
const myFunction = () => {
};
```

</details>

### `coder.indent`

A utility method to increase the indentation level.
Typically this method is not called directly and
`coder.openBlock` is used instead.

```ts
const coder = new Coder();

coder.line("const x = {");
coder.indent();
coder.line(`key: "value",`);
coder.dedent();
coder.line("};");

console.log(coder.code);
```

<details>
<summary>See Output</summary>

```js
const x = {
	key: "value",
};
```

</details>

### `coder.dedent`

A utility method to decrease the indentation level.
Typically this method is not called directly and
`coder.closeBlock` is used instead.

```ts
const coder = new Coder();

coder.line("const x = {");
coder.indent();
coder.line(`key: "value",`);
coder.dedent();
coder.line("};");

console.log(coder.code);
```

<details>
<summary>See Output</summary>

```js
const x = {
	key: "value",
};
```

</details>

### `coder.reset`

If you would like to use the same `Coder` instance
multiple times to write different files, you can call
`coder.reset()` to wipe the current code and set the
indentation level back to zero.

```ts
const coder = new Coder();

coder.line(`console.log("a");`);

// Wipes all state, so any previous changes are lost!
coder.reset();

coder.line(`console.log("b");`);

console.log(coder.code);
```

<details>
<summary>See Output</summary>

```js
console.log("b");
```

</details>
