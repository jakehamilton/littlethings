import useCSS from "../../../hooks/useCSS";
import { ButtonBaseProps } from "../../ButtonBase";

export interface TextButtonStylesOptions {
	color: NonNullable<ButtonBaseProps["color"]>;
}

const useTextButtonStyles = ({ color }: TextButtonStylesOptions) => {
	const classes = useCSS(({ css, util }) => {
		const themeColor = util.color(color);

		return {
			root: css`
				color: ${themeColor.main};
			`,
		};
	});

	return classes;
};

export default useTextButtonStyles;
