import useCSS from "../../hooks/useCSS";

const CSSBase = () => {
	// @TODO(jakehamilton): Come back and turn this into an object
	//  for bundle size improvements.
	useCSS(({ glob, theme, util }) => {
		const background = util.color("background");

		glob`
/* Box sizing rules */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* Default input styles */
input, button {
  appearance: none;
  -webkit-appearance: none;
}

/* Remove default margin */
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

/* Remove list styles on ul, ol elements with a list role, which suggests default styling will be removed */
ul[role='list'],
ol[role='list'] {
  list-style: none;
}

/* Set core root defaults */
html:focus-within {
  scroll-behavior: smooth;
}

/* Set core body defaults */
body {
  min-height: 100vh;
  text-rendering: optimizeLegibility;
}

/* A elements that don't have a class get default styles */
a:not([class]) {
  text-decoration-skip-ink: auto;
}

/* Make images easier to work with */
img,
picture {
  max-width: 100%;
  display: block;
}

/* Inherit fonts for inputs and buttons */
input,
button,
textarea,
select {
  font: inherit;
}

html {
  font-size: ${theme.typography.base}px;
  font-family: ${theme.typography.primary.family};
  font-weight: normal;
  color: ${background.text};
  background: ${background.main};
}`;

		return {};
	});

	return null;
};

export default CSSBase;
