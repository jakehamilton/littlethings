# @littlethings/css

> A small css-in-js utility.

## Installation

```shell
# Using npm
npm install @littlethings/css

# Using yarn
yarn add @littlethings/css
```

## Usage

### Import

LittleCSS exposes a few named exports.

```ts
import { css, glob, keyframes, clsx } from "@littlethings/css";
```

-   [`css`](#css)
-   [`glob`](#glob)
-   [`keyframes`](#keyframes)
-   [`clsx`](#clsx)

### `css`

The `css` utility generates a unique class name for a set of
styles.

```ts
const myClass = css({
	"font-style": "italic",
	// camelCase is also supported
	backgroundColor: "pink",
});
```

This utility can also be used as a tagged template function.

```ts
const myClass = css`
	font-style: italic;
	background-color: pink;
`;
```

It is also possible to nest styles.

```ts
const myClass = css({
	"font-style": "italic",
	".inner-class": {
		"font-style": "initial",
	},
});
```

Nesting is supported in tagged templates as well.

```ts
const myClass = css`
	font-style: italic;

	.inner-class {
		font-style: initial;
	}
`;
```

### `glob`

The `glob` utility applies CSS to the whole document.

```ts
glob({
	html: {
		background: "pink",
	},
});
```

This utility can also be used as a tagged template function.

```ts
glob`
	html {
		background: pink;
	}
`;
```

### `keyframes`

The `keyframes` utility creates a keyframes definition to
use in your other CSS.

```ts
const myAnimation = keyframes({
	from: {
		background: "orange",
	},
	to: {
		background: "rebeccapurple",
	},
});

// Use the animation in your CSS
const myClass = css({
	animation: `${myAnimation} 3s linear`,
});
```

This utility can also be used as a tagged template function.

```ts
const myAnimation = keyframes`
	from {
		background: orange;
	}
	to {
		background: rebeccapurple;
	}
`;

// Use the animation in your CSS
const myClass = css`
	animation: ${myAnimation} 3s linear;
`;
```

### `clsx`

This utility is used to combine class names.
This is necessary to ensure styles are overriden
correctly.

```ts
const classA = css`
	color: yellow;
	background: white;
`;

const classB = css`
	color: red;
`;

const myClass = clsx(classA, classB);
// `myClass` will apply the following styles
// color: red;
// background: white;
```

The `clsx` utility also supports passing falsey
values like `undefined`, `null`, and `false` for
convenient toggling of classes during use. See the
following code for an example.

```tsx
// This example shows usage in a Preact component
const MyComponent = ({ isError, children }) => {
	const baseClass = css`
		color: black;
	`;

	const errorClass = css`
		color: white;
		background: red;
	`;

	return <div class={clsx(baseClass, isError && errorClass)}>{children}</div>;
};
```
