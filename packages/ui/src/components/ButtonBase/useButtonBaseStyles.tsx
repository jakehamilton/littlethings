import { ComponentChildren } from "preact";
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
	hasPrefixIcon?: boolean;
	hasPostfixIcon?: boolean;
}

interface Padding {
	left: number;
	right: number;
	top: number;
	bottom: number;
}

const getPadding = (
	size: Size,
	hasPrefixIcon: ButtonBaseStylesOptions["hasPrefixIcon"],
	hasPostfixIcon: ButtonBaseStylesOptions["hasPostfixIcon"]
): Padding => {
	switch (size) {
		case "sm":
			return {
				left: hasPrefixIcon ? 1.5 : 1.75,
				right: hasPostfixIcon ? 1.5 : 1.75,
				top: 0.75,
				bottom: 0.75,
			};
		case "md":
			return {
				left: hasPrefixIcon ? 1.75 : 2,
				right: hasPostfixIcon ? 1.75 : 2,
				top: 1,
				bottom: 1,
			};
		case "lg":
			return {
				left: hasPrefixIcon ? 2 : 2.25,
				right: hasPostfixIcon ? 2 : 2.25,
				top: 1,
				bottom: 1,
			};
		case "xl":
			return {
				left: hasPrefixIcon ? 2.5 : 2.75,
				right: hasPostfixIcon ? 2.5 : 2.75,
				top: 1.5,
				bottom: 1.5,
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
	disabled,
	hasPrefixIcon,
	hasPostfixIcon,
}: ButtonBaseStylesOptions) => {
	const classes = useCSS(({ css, theme, util }) => {
		const background = theme.palette.background;

		const themeColor = color ? util.color(color) : undefined;

		const padding = getPadding(size, hasPrefixIcon, hasPostfixIcon);

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

				cursor: ${disabled ? "initial" : "pointer"};
				border-radius: ${util.round("sm")}px;

				font-size: ${fontSize.size}rem;
				font-weight: ${getFontWeight(size)};
				line-height: ${fontSize.height}rem;
				text-transform: uppercase;

				padding-left: ${util.space(padding.left)}px;
				padding-right: ${util.space(padding.right)}px;
				padding-top: ${util.space(padding.top)}px;
				padding-bottom: ${util.space(padding.bottom)}px;

				&:focus {
					outline: none;
				}

				&::before {
					position: absolute;
					display: block;
					content: "";

					width: calc(100% + ${util.space(2)}px);
					height: calc(100% + ${util.space(2)}px);

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
			container: css`
				position: relative;
			`,
			loading: css`
				position: absolute;
				width: 100%;
				height: 100%;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			`,
			content: css`
				opacity: ${loading ? 0 : 1};
				visibility: ${loading ? "hidden" : "visible"};
			`,
			prefixIcon: css`
				display: inline-flex;
				margin-right: ${util.space(0.5)}px;
			`,
			postfixIcon: css`
				display: inline-flex;
				margin-left: ${util.space(0.5)}px;
			`,
		};
	});

	return classes;
};

export default useButtonBaseStyles;
