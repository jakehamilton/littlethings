import useCSS from "../../src/hooks/useCSS";
import Button from "../../src/components/Button";
import Prose from "../../src/components/Prose";
import Gap from "../../src/components/Gap";
import { Github } from "preact-feather";

const Buttons = () => {
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
				gap: `${util.space(1)}px`,
			}),
		};
	});

	return (
		<div class={classes.root}>
			<Prose as="h2" size="xl">
				Buttons
			</Prose>
			<Prose size="md" variant="secondary">
				Buttons are available in several different variants including{" "}
				<Prose size="md" color="primary">
					filled
				</Prose>
				,{" "}
				<Prose size="md" color="primary">
					outlined
				</Prose>
				,{" "}
				<Prose size="md" color="primary">
					text
				</Prose>
				, and{" "}
				<Prose size="md" color="primary">
					icon
				</Prose>
				.
			</Prose>
			<Gap vertical size={2} />
			<Prose as="h3" size="lg">
				Filled Buttons
			</Prose>
			<Prose size="md" variant="secondary">
				Filled buttons support{" "}
				<Prose size="md" color="primary">
					loading
				</Prose>
				,{" "}
				<Prose size="md" color="primary">
					float
				</Prose>
				, and being{" "}
				<Prose size="md" color="primary">
					disabled
				</Prose>
				.
			</Prose>
			<Gap vertical size={2} />
			<div class={classes.example}>
				<Button variant="filled" float>
					Button
				</Button>
				<Button variant="filled" float disabled>
					Button
				</Button>
				<Button variant="filled" float loading>
					Button
				</Button>
				<Button variant="filled" float loading disabled>
					Button
				</Button>
			</div>
			<Gap vertical size={2} />
			<div class={classes.example}>
				<Button variant="filled">Button</Button>
				<Button variant="filled" disabled>
					Button
				</Button>
				<Button variant="filled" loading>
					Button
				</Button>
				<Button variant="filled" loading disabled>
					Button
				</Button>
			</div>
			<Gap vertical size={2} />
			<div class={classes.example}>
				<Button variant="filled" float color="secondary">
					Button
				</Button>
				<Button variant="filled" float disabled color="secondary">
					Button
				</Button>
				<Button variant="filled" float loading color="secondary">
					Button
				</Button>
				<Button
					variant="filled"
					float
					loading
					disabled
					color="secondary"
				>
					Button
				</Button>
			</div>
			<Gap vertical size={2} />
			<div class={classes.example}>
				<Button variant="filled" color="secondary">
					Button
				</Button>
				<Button variant="filled" disabled color="secondary">
					Button
				</Button>
				<Button variant="filled" loading color="secondary">
					Button
				</Button>
				<Button variant="filled" loading disabled color="secondary">
					Button
				</Button>
			</div>
			<Gap vertical size={4} />
			<Prose as="h3" size="lg">
				Outlined Buttons
			</Prose>
			<Prose size="md" variant="secondary">
				Outlined buttons support{" "}
				<Prose size="md" color="primary">
					loading
				</Prose>{" "}
				and being{" "}
				<Prose size="md" color="primary">
					disabled
				</Prose>
				.
			</Prose>
			<Gap vertical size={2} />
			<div class={classes.example}>
				<Button variant="outlined">Button</Button>
				<Button variant="outlined" disabled>
					Button
				</Button>
				<Button variant="outlined" loading>
					Button
				</Button>
				<Button variant="outlined" loading disabled>
					Button
				</Button>
			</div>
			<Gap vertical size={2} />
			<div class={classes.example}>
				<Button variant="outlined" color="secondary">
					Button
				</Button>
				<Button variant="outlined" disabled color="secondary">
					Button
				</Button>
				<Button variant="outlined" loading color="secondary">
					Button
				</Button>
				<Button variant="outlined" loading disabled color="secondary">
					Button
				</Button>
			</div>
			<Gap vertical size={4} />
			<Prose as="h3" size="lg">
				Text Buttons
			</Prose>
			<Prose size="md" variant="secondary">
				Text buttons support{" "}
				<Prose size="md" color="primary">
					loading
				</Prose>{" "}
				and being{" "}
				<Prose size="md" color="primary">
					disabled
				</Prose>
				.
			</Prose>
			<Gap vertical size={2} />
			<div class={classes.example}>
				<Button variant="text">Button</Button>
				<Button variant="text" disabled>
					Button
				</Button>
				<Button variant="text" loading>
					Button
				</Button>
				<Button variant="text" loading disabled>
					Button
				</Button>
			</div>
			<Gap vertical size={2} />
			<div class={classes.example}>
				<Button variant="text" color="secondary">
					Button
				</Button>
				<Button variant="text" disabled color="secondary">
					Button
				</Button>
				<Button variant="text" loading color="secondary">
					Button
				</Button>
				<Button variant="text" loading disabled color="secondary">
					Button
				</Button>
			</div>
			<Gap vertical size={4} />
			<Prose as="h3" size="lg">
				Icon Buttons
			</Prose>
			<Prose size="md" variant="secondary">
				Icon buttons support{" "}
				<Prose size="md" color="primary">
					loading
				</Prose>{" "}
				and being{" "}
				<Prose size="md" color="primary">
					disabled
				</Prose>
				.
			</Prose>
			<Gap vertical size={2} />
			<div class={classes.example}>
				<Button variant="icon">
					<Github />
				</Button>
				<Button variant="icon" disabled>
					<Github />
				</Button>
				<Button variant="icon" loading>
					<Github />
				</Button>
				<Button variant="icon" loading disabled>
					<Github />
				</Button>
			</div>
			<Gap vertical size={2} />
			<div class={classes.example}>
				<Button variant="icon" color="secondary">
					<Github />
				</Button>
				<Button variant="icon" disabled color="secondary">
					<Github />
				</Button>
				<Button variant="icon" loading color="secondary">
					<Github />
				</Button>
				<Button variant="icon" loading disabled color="secondary">
					<Github />
				</Button>
			</div>
		</div>
	);
};

export default Buttons;
