import useCSS from "../../src/hooks/useCSS";
import Button from "../../src/components/Button";
import Prose from "../../src/components/Prose";
import Gap from "../../src/components/Gap";
import { Airplay, Eye, Feather, Save } from "preact-feather";
import Input from "../../src/components/Input";

const TextInputs = () => {
	const classes = useCSS(TextInputs, ({ css, util }) => {
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
				TextInputs
			</Prose>
			<Prose size="md" variant="secondary">
				TextInputs support{" "}
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
						placeholder="Enter something..."
					/>
				</div>
				<div>
					<Input
						class={classes.input}
						placeholder="Enter something..."
						prefixIcon={<Airplay />}
					/>
				</div>
				<div>
					<Input
						class={classes.input}
						placeholder="Enter something..."
						postfixIcon={<Eye />}
					/>
				</div>
				<Gap vertical size={1} />
				<div>
					<Input
						class={classes.input}
						placeholder="Enter something..."
						border="primary"
					/>
				</div>
				<div>
					<Input
						class={classes.input}
						placeholder="Enter something..."
						prefixIcon={<Airplay />}
						border="primary"
					/>
				</div>
				<div>
					<Input
						class={classes.input}
						placeholder="Enter something..."
						postfixIcon={<Eye />}
						border="primary"
					/>
				</div>
				<Gap vertical size={1} />
				<div>
					<Input
						class={classes.input}
						placeholder="Enter something..."
						border="secondary"
						focus="secondary"
					/>
				</div>
				<div>
					<Input
						class={classes.input}
						placeholder="Enter something..."
						prefixIcon={<Airplay />}
						border="secondary"
						focus="secondary"
					/>
				</div>
				<div>
					<Input
						class={classes.input}
						placeholder="Enter something..."
						postfixIcon={<Eye />}
						border="secondary"
						focus="secondary"
					/>
				</div>
				<Gap vertical size={1} />
				<div>
					<Input
						class={classes.input}
						placeholder="Enter something..."
						as="textarea"
					/>
				</div>
				<div>
					<Input
						class={classes.input}
						placeholder="Enter something..."
						as="textarea"
						prefixIcon={<Feather />}
					/>
				</div>
				<div>
					<Input
						class={classes.input}
						placeholder="Enter something..."
						as="textarea"
						postfixIcon={<Save />}
					/>
				</div>
				<Gap vertical size={1} />
				<div>
					<Input
						class={classes.input}
						placeholder="Enter something..."
						disabled
					/>
				</div>
				<div>
					<Input
						class={classes.input}
						placeholder="Enter something..."
						prefixIcon={<Airplay />}
						disabled
					/>
				</div>
				<div>
					<Input
						class={classes.input}
						placeholder="Enter something..."
						postfixIcon={<Eye />}
						disabled
					/>
				</div>
				<Gap vertical size={1} />
				<div>
					<Input
						class={classes.input}
						placeholder="Enter something..."
						as="textarea"
						disabled
					/>
				</div>
				<div>
					<Input
						class={classes.input}
						placeholder="Enter something..."
						as="textarea"
						prefixIcon={<Feather />}
						disabled
					/>
				</div>
				<div>
					<Input
						class={classes.input}
						placeholder="Enter something..."
						as="textarea"
						postfixIcon={<Save />}
						disabled
					/>
				</div>
			</div>
		</div>
	);
};

export default TextInputs;
