import Prose from "../../src/components/Prose";
import Gap from "../../src/components/Gap";
import { Airplay, Eye, Feather, Save } from "preact-feather";
import Input from "../../src/components/Input";
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
			flexDirection: "column",
			flexWrap: "wrap",
			gap: `${theme.space(1)}px`,
		},
		input: {
			minWidth: "400px",
			[`& textarea`]: {
				height: "150px",
				resize: "none",
			},
		},
	};
});

const Selects = () => {
	const classes = useStyles();

	return (
		<div class={classes.root}>
			<Prose as="h2" size="xl">
				Select
			</Prose>
			<Prose size="md" variant="secondary">
				Select support{" "}
				<Prose size="md" color="primary">
					prefix icons
				</Prose>
				,{" "}
				<Prose size="md" color="primary">
					postfix icons
				</Prose>
				, and being{" "}
				<Prose size="md" color="primary">
					disabled
				</Prose>
				.
			</Prose>
			<Gap vertical size={2} />
			<div class={classes.example}>
				<div>
					<Input
						class={classes.input}
						as="select"
						placeholder="Enter something..."
					>
						<option>One</option>
						<option>Two</option>
					</Input>
				</div>
				<Gap vertical size={2} />
				<div>
					<select>
						<option>One</option>
						<option>Two</option>
					</select>
				</div>
			</div>
		</div>
	);
};

export default Selects;
