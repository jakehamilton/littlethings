import useCSS from "../../hooks/useCSS";
import { ThemePaletteColor, ThemePaletteColorNames } from "../../types/theme";

export type Size = "sm" | "md" | "lg" | "xl";

export interface LoadingStylesOptions {
	color: ThemePaletteColorNames | ThemePaletteColor | "text";
	size: Size;
}

interface Measurements {
	rootSize: number;
	dotSize: number;
}

const getMeasurements = (size: Size): Measurements => {
	switch (size) {
		case "sm":
			return {
				rootSize: 19,
				dotSize: 8,
			};
		case "md":
			return {
				rootSize: 22,
				dotSize: 9,
			};
		case "lg":
			return {
				rootSize: 24,
				dotSize: 10,
			};
		case "xl":
			return {
				rootSize: 30,
				dotSize: 13,
			};
	}
};

const useLoadingStyles = ({ color, size }: LoadingStylesOptions) => {
	const classes = useCSS(({ css, keyframes, theme, util }) => {
		const themeColor =
			color === "text"
				? {
						light: theme.typography.color.primary,
						main: theme.typography.color.primary,
						dark: theme.typography.color.primary,
						text: theme.typography.color.primary,
				  }
				: util.color(color);

		const { rootSize, dotSize } = getMeasurements(size);

		const spin = keyframes`
      from {
        transform: translate(-50%, -50%) rotate(0deg);
      }

      to {
        transform: translate(-50%, -50%) rotate(360deg);
      }
    `;

		return {
			root: css`
				position: relative;
				width: ${rootSize}px;
				height: ${rootSize}px;
			`,
			container: css`
				position: absolute;

				width: ${rootSize}px;
				height: ${rootSize}px;

				top: 50%;
				left: 50%;

				transform: translate(-50%, -50%) rotate(0);
				animation: ${spin} 1.3s cubic-bezier(0.53, 0.16, 0.39, 0.9)
					infinite;
			`,
			dot: css`
				position: absolute;

				width: ${dotSize}px;
				height: ${dotSize}px;

				border-radius: 50%;

				background: ${themeColor.main};

				&:nth-child(1) {
					top: 0;
					left: 0;
				}

				&:nth-child(2) {
					top: 0;
					right: 0;
				}

				&:nth-child(3) {
					bottom: 0;
					left: 0;
				}

				&:nth-child(4) {
					bottom: 0;
					right: 0;
				}
			`,
		};
	});

	return classes;
};

export default useLoadingStyles;
