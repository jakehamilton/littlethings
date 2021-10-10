import useCSS from "../../hooks/useCSS";

const useRippleStyles = () => {
	const classes = useCSS(({ css }) => {
		return {
			root: css`
				position: absolute;
				overflow: hidden;

				top: 0;
				left: 0;
				right: 0;
				bottom: 0;

				z-index: 0;
				border-radius: inherit;

				pointer-events: none;
			`,
		};
	});

	return classes;
};

export default useRippleStyles;
