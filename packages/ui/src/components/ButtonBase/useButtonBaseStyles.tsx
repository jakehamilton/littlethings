import { ComponentChildren } from "preact";
import useCSS from "../../hooks/useCSS";
import {
	ThemeColorName,
	ThemeFont,
	ThemePaletteColor,
	ThemePaletteColorName,
} from "../../types/theme";

export type Size = "sm" | "md" | "lg" | "xl";

export interface ButtonBaseStylesOptions {
	color: ThemeColorName | ThemePaletteColor | "text";
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

const getFontWeight = (size: Size): string => {
	switch (size) {
		case "sm":
			return "600";
		case "md":
			return "600";
		case "lg":
			return "600";
		case "xl":
			return "600";
	}
};

const useButtonBaseStyles = (
	color: ButtonBaseStylesOptions["color"],
	size: ButtonBaseStylesOptions["size"],
	loading: ButtonBaseStylesOptions["loading"],
	disabled: ButtonBaseStylesOptions["disabled"],
	hasPrefixIcon: ButtonBaseStylesOptions["hasPrefixIcon"],
	hasPostfixIcon: ButtonBaseStylesOptions["hasPostfixIcon"]
) => {
	const classes = useCSS(
		useButtonBaseStyles,
		({ css, theme, util }) => {
			const themeColor =
				color === "text" ? util.color("background") : util.color(color);

			const padding = getPadding(size, hasPrefixIcon, hasPostfixIcon);

			const font = util.font("primary");

			const fontSize = font.sizes[getFontSize(size)];

			const focusRingColor =
				color === "text" || color === "background"
					? theme.typography.color.primary
					: themeColor.main;

			return {
				root: css({
					display: "inline-flex",
					alignItems: "center",
					position: "relative",

					border: "none",
					outline: "none",
					background: "transparent",

					cursor: disabled ? "initial" : "pointer",
					borderRadius: `${util.round("sm")}px`,

					fontSize: `${fontSize.size}rem`,
					fontWeight: getFontWeight(size),
					lineHeight: `${fontSize.height}rem`,
					textTransform: "uppercase",

					paddingLeft: `${util.space(padding.left)}px`,
					paddingRight: `${util.space(padding.right)}px`,
					paddingTop: `${util.space(padding.top)}px`,
					paddingBottom: `${util.space(padding.bottom)}px`,

					"&:focus": {
						outline: "none",
					},

					"&::before": {
						position: "absolute",
						display: "block",
						content: "''",

						width: `calc(100% + ${util.space(2)}px)`,
						height: `calc(100% + ${util.space(2)}px)`,

						top: "50%",
						left: "50%",

						transform: "translate(-50%, -50%)",

						border: `4px solid ${focusRingColor}`,
						borderRadius: `${util.round("md")}px`,

						opacity: "0",
						visibility: "hidden",
						pointerEvents: "none",
					},

					"&:focus-visible": {
						"&::before": {
							opacity: "1",
							visibility: "visible",
						},
					},
				}),
				container: css({
					position: "relative",
				}),
				loading: css({
					position: "absolute",
					width: "100%",
					height: "100%",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
				}),
				content: css({
					opacity: loading ? "0" : "1",
					visibility: loading ? "hidden" : "visible",
				}),
				prefixIcon: css({
					display: "inline-flex",
					marginRight: `${util.space(0.5)}px`,
				}),
				postfixIcon: css({
					display: "inline-flex",
					marginLeft: `${util.space(0.5)}px`,
				}),
			};
		},
		[color, size, loading, disabled, hasPrefixIcon, hasPostfixIcon]
	);

	return classes;
};

export default useButtonBaseStyles;
