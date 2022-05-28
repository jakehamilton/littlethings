import { useEffect } from "preact/hooks";
import { style } from "../../theme/style";
import { CSSClass, CSSClasses } from "../../types/css";
import { Theme } from "../../types/theme";

export interface CSSBaseClasses extends CSSClasses {
	body: CSSClass;
}

const { useStyles, useOverrides, useClasses, glob } = style((theme: Theme) => {
	const color = theme.color("background.text");
	const background = theme.color("background.main");

	return {
		body: {
			fontSize: `${theme.typography.base}px`,
			fontFamily: `${theme.typography.primary.family}`,
			fontWeight: "normal",
			color,
			background,
		},
	};
});

const CSSBase = () => {
	// @TODO(jakehamilton): Come back and turn this into an object
	//  for bundle size improvements.
	const styles = useStyles();

	useEffect(() => {
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
	}, []);

	const overrides = useOverrides("CSSBase");

	const classes = useClasses(styles, overrides);

	useEffect(() => {
		if (classes.body === undefined) {
			return;
		}

		for (const classname of classes.body.split(" ")) {
			if (classname) {
				document.body.classList.add(classname);
			}
		}

		return () => {
			for (const classname of classes.body!.split(" ")) {
				if (classname) {
					document.body.classList.remove(classname);
				}
			}
		};
	}, [classes.body]);

	return null;
};

export default CSSBase;
