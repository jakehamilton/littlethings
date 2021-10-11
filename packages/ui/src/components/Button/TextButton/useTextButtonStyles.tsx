import useCSS from "../../../hooks/useCSS";
import { ButtonBaseProps } from "../../ButtonBase";

export interface TextButtonStylesOptions {
	color: NonNullable<ButtonBaseProps["color"]>;
	disabled: NonNullable<ButtonBaseProps["disabled"]>;
}

const useTextButtonStyles = ({ color, disabled }: TextButtonStylesOptions) => {
	const classes = useCSS(({ css, util }) => {
		const themeColor = util.color(color);
		const disabledColor = util.color("disabled");

		return {
			root: css`
				color: ${themeColor.main};
			`,
			disabled: css`
				color: ${disabledColor.text};
			`,
			dot: css`
				background: ${disabled ? disabledColor.text : themeColor.main};
			`,
		};
	});

	return classes;
};

export default useTextButtonStyles;
