import useCSS from "../../../hooks/useCSS";
import { ButtonBaseProps } from "../../ButtonBase";

export interface OutlinedButtonStylesOptions {
	color: NonNullable<ButtonBaseProps["color"]>;
	disabled: NonNullable<ButtonBaseProps["disabled"]>;
}

const useOutlinedButtonStyles = ({
	color,
	disabled,
}: OutlinedButtonStylesOptions) => {
	const classes = useCSS(({ css, util }) => {
		const themeColor = util.color(color);
		const disabledColor = util.color("disabled");

		return {
			root: css`
				color: ${themeColor.main};
				border: 2px solid ${themeColor.main};
			`,
			disabled: css`
				color: ${disabledColor.text};
				border: 2px solid ${disabledColor.text};
			`,
		};
	});

	return classes;
};

export default useOutlinedButtonStyles;
