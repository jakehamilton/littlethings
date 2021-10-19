import useCSS from "../../hooks/useCSS";

export interface GapStylesOptions {
	size: number;
	vertical?: boolean;
	horizontal?: boolean;
}

const useGapStyles = ({ size }: GapStylesOptions) => {
	const classes = useCSS(({ css, util }) => {
		const margin = util.space(size);
		return {
			root: css({}),
			vertical: css({
				marginTop: `${margin}px`,
			}),
			horizontal: css({
				marginLeft: `${margin}px`,
			}),
		};
	});

	return classes;
};

export default useGapStyles;
