import { clsx } from "@littlethings/css";
import { Meta, Story } from "@storybook/preact";
import Surface, { SurfaceProps } from ".";
import { select, themeColor } from "../../../.storybook/controls";
import useCSS from "../../hooks/useCSS";

export default {
	title: "Design System/Surface",
	component: Surface,
	args: {
		elevation: "none",
	},
	argTypes: {
		color: themeColor("background"),
		elevation: select({
			defaultValue: "md",
			options: ["xs", "sm", "md", "lg", "xl"],
		}),
	},
} as Meta<SurfaceProps>;

const Template: Story<SurfaceProps> = (args) => {
	const classes = useCSS(Template, ({ css, util }) => {
		return {
			root: css({
				width: `${util.space(10)}px`,
				height: `${util.space(10)}px`,
				borderRadius: `${util.round("md")}px`,
			}),
		};
	});
	return <Surface {...args} class={classes.root} />;
};

export const Default: Story<SurfaceProps> = (args) => {
	const classes = useCSS(Default, ({ css, util }) => {
		return {
			root: css({
				display: "flex",
				flexWrap: "wrap",
				gap: `${util.space(4)}px`,
			}),
			surface: css({
				width: `${util.space(8)}px`,
				height: `${util.space(8)}px`,
				borderRadius: `${util.round("sm")}px`,
			}),
		};
	});

	return (
		<div class={classes.root}>
			<Surface {...args} elevation="xs" class={classes.surface} />
			<Surface {...args} elevation="sm" class={classes.surface} />
			<Surface {...args} elevation="md" class={classes.surface} />
			<Surface {...args} elevation="lg" class={classes.surface} />
			<Surface {...args} elevation="xl" class={classes.surface} />
		</div>
	);
};

export const ExtraSmall = Template.bind({});
ExtraSmall.args = {
	elevation: "xs",
};

export const Small = Template.bind({});
Small.args = {
	elevation: "sm",
};

export const Medium = Template.bind({});
Medium.args = {
	elevation: "md",
};

export const Large = Template.bind({});
Large.args = {
	elevation: "lg",
};

export const ExtraLarge = Template.bind({});
ExtraLarge.args = {
	elevation: "xl",
};
