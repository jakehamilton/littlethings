import { useEffect } from "preact/hooks";
import useCSS from "../../hooks/useCSS";

const CSSBase = () => {
	// @TODO(jakehamilton): Come back and turn this into an object
	//  for bundle size improvements.
	const classes = useCSS(CSSBase, ({ glob, css, theme, util }) => {
		const background = util.color("background");

		/*
		 *This appears to cause a bug in Firefox so it has been removed:
		 *
		 * html:focus-within {
		 * 	scroll-behavior: smooth;
		 * }
		 *
		 *https://twitter.com/jakehamiltondev/status/1452198179806629891?s=20
		 */

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
  min-height: 100vh;
  text-rendering: optimizeLegibility;
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
}
`;

		return {
			body: css({
				fontSize: `${theme.typography.base}px`,
				fontFamily: `${theme.typography.primary.family}`,
				fontWeight: "normal",
				color: background.text,
				background: background.main,
			}),
		};
	});

	useEffect(() => {
		document.body.classList.add(classes.body);

		return () => {
			document.body.classList.remove(classes.body);
		};
	}, [classes.body]);

	return null;
};

export default CSSBase;
