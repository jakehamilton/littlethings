import useCSS from "../../src/hooks/useCSS";
import Prose from "../../src/components/Prose";
import Gap from "../../src/components/Gap";
import { Airplay, Eye, Feather, Save } from "preact-feather";
import Input from "../../src/components/Input";

const Selects = () => {
	const classes = useCSS(Selects, ({ css, util }) => {
		return {
			root: css({
				display: "flex",
				flexDirection: "column",
				padding: `${util.space(4)}px`,
			}),
			example: css({
				display: "flex",
				flexDirection: "column",
				flexWrap: "wrap",
				gap: `${util.space(1)}px`,
			}),
			input: css({
				minWidth: "400px",
				[`& textarea`]: {
					height: "150px",
					resize: "none",
				},
			}),
		};
	});

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
