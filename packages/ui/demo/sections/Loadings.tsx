import Prose from "../../src/components/Prose";
import Gap from "../../src/components/Gap";
import Loading from "../../src/components/Loading";
import { style } from "../../src/theme/style";

const { useStyles } = style((theme) => {
	return {
		root: {
			display: "flex",
			flexDirection: "column",
			padding: `${theme.space(4)}px`,
		},
		example: {
			display: "flex",
			flexWrap: "wrap",
			gap: `${theme.space(3)}px`,
			paddingLeft: `${theme.space(1)}px`,
		},
	};
});

const Loadings = () => {
	const classes = useStyles();

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
				{/* <Loading color="text" /> */}
			</div>
		</div>
	);
};

export default Loadings;
