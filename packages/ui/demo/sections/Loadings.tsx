import useCSS from "../../src/hooks/useCSS";
import Prose from "../../src/components/Prose";
import Gap from "../../src/components/Gap";
import Loading from "../../src/components/Loading";

const Loadings = () => {
	const classes = useCSS(({ css, util }) => {
		return {
			root: css({
				display: "flex",
				flexDirection: "column",
				padding: `${util.space(4)}px`,
			}),
			example: css({
				display: "flex",
				flexWrap: "wrap",
				gap: `${util.space(3)}px`,
				paddingLeft: `${util.space(1)}px`,
			}),
		};
	});

	return (
		<div class={classes.root}>
			<Prose as="h2" size="xl">
				Loading
			</Prose>
			<Prose size="md" variant="secondary">
				Loading icons can easily be colored and used within other
				components.
			</Prose>
			<Gap vertical size={2} />
			<div class={classes.example}>
				<Loading color="primary" />
				<Loading color="secondary" />
				<Loading color="text" />
			</div>
		</div>
	);
};

export default Loadings;
