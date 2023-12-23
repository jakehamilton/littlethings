import { glob } from "@littlethings/css";

glob`
*,
*::before,
*::after {
	box-sizing: border-box;
}

input, button, select {
	appearance: none;
	-webkit-appearance: none;
}

body,
h1,
h2,
h3,
h4,
p,
figure,
blockquote,
dl,
dd {
	margin: 0;
}

ul[role='list'],
ol[role='list'] {
	list-style: none;
}

body {
	font-size: 16px;
	min-height: 100svh;
	text-rendering: optimizeLegibility;
	font-family: Manrope, sans-serif;
}

a:not([class]) {
	text-decoration-skip-ink: auto;
}

img,
picture {
	max-width: 100%;
	display: block;
}

input,
button,
textarea,
select {
	font: inherit;
	color: inherit;
	background: transparent;
	border: none;
}

#app {
	position: relative;
}
`;
