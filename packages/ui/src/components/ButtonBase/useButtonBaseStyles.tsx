import useCSS from "../../hooks/useCSS";
import {
	ThemeFont,
	ThemePaletteColor,
	ThemePaletteColorNames,
} from "../../types/theme";

export type Size = "sm" | "md" | "lg" | "xl";

export interface ButtonBaseStylesOptions {
	color?: ThemePaletteColorNames | ThemePaletteColor;
	size: Size;
	loading: boolean;
	disabled: boolean;
}

const getPadding = (size: Size): { x: number; y: number } => {
	switch (size) {
		case "sm":
			return {
				x: 1.75,
				y: 0.75,
			};
		case "md":
			return {
				x: 2,
				y: 1,
			};
		case "lg":
			return {
				x: 2.25,
				y: 1,
			};
		case "xl":
			return {
				x: 2.75,
				y: 1.5,
			};
	}
};

const getFontSize = (size: Size): keyof ThemeFont["sizes"] => {
	switch (size) {
		case "sm":
			return "sm";
		case "md":
			return "sm";
		case "lg":
			return "md";
		case "xl":
			return "lg";
	}
};

const getFontWeight = (size: Size): number => {
	switch (size) {
		case "sm":
			return 600;
		case "md":
			return 600;
		case "lg":
			return 600;
		case "xl":
			return 600;
	}
};

const useButtonBaseStyles = ({
	color,
	size,
	loading,
}: ButtonBaseStylesOptions) => {
	const classes = useCSS(({ css, theme, util }) => {
		const background = theme.palette.background;

		const themeColor = color ? util.color(color) : undefined;

		const padding = getPadding(size);

		const font = util.font("primary");

		const fontSize = font.sizes[getFontSize(size)];

		const focusRingColor =
			themeColor && util.isReadable(background.main, themeColor.main)
				? themeColor.main
				: theme.typography.color.secondary;

		return {
			root: css`
				display: inline-flex;
				align-items: center;
				position: relative;

				border: none;
				outline: none;
				background: transparent;

				cursor: pointer;
				border-radius: ${util.round("sm")}px;

				font-size: ${fontSize.size}rem;
				font-weight: ${getFontWeight(size)};
				line-height: ${fontSize.height}rem;
				text-transform: uppercase;

				padding: ${util.space(padding.y)}px ${util.space(padding.x)}px;

				&:focus {
					outline: none;
				}

				&::before {
					position: absolute;
					display: block;
					content: "";

					width: calc(100% + ${util.space(1.5)}px);
					height: calc(100% + ${util.space(1.5)}px);

					top: 50%;
					left: 50%;

					transform: translate(-50%, -50%);

					border: 4px solid ${focusRingColor};
					border-radius: ${util.round("md")}px;

					opacity: 0;
					visibility: hidden;
					pointer-events: none;
				}

				&:focus-visible {
					&::before {
						opacity: 1;
						visibility: visible;
					}
				}
			`,
		};
	});

	return classes;
};

export default useButtonBaseStyles;
