import useCSS from "../../../hooks/useCSS";
import { ButtonBaseProps } from "../../ButtonBase";

export interface OutlinedButtonStylesOptions {
	color: NonNullable<ButtonBaseProps["color"]>;
}

const useOutlinedButtonStyles = ({ color }: OutlinedButtonStylesOptions) => {
	const classes = useCSS(({ css, util }) => {
		const themeColor = util.color(color);

		return {
			root: css`
				color: ${themeColor.main};
				border: 2px solid ${themeColor.main};
			`,
		};
	});

	return classes;
};

export default useOutlinedButtonStyles;
