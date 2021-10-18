import { clsx } from "@littlethings/css";
import { Meta, Story } from "@storybook/preact";
import Prose, { ProseProps } from ".";
import { disable, select, themeColor } from "../../../.storybook/controls";
import useCSS from "../../hooks/useCSS";

export default {
	title: "Design System/Prose",
	component: Prose,
	args: {},
	argTypes: {
		size: select({
			description: "Change the size of the text.",
			defaultValue: "md",
			options: ["xs", "sm", "md", "lg", "xl"],
		}),
		font: select({
			description: "Change the font used.",
			defaultValue: "primary",
			options: ["primary", "secondary"],
		}),
		variant: select({
			description:
				'Use the font\'s primary or secondary color (if "color" is not set).',
			defaultValue: undefined,
			options: [undefined, "primary", "secondary"],
		}),
		color: select({
			description:
				"Use a palette color instead of the font's primary or secondary color.",
			defaultValue: undefined,
			options: [undefined, "primary", "secondary"],
		}),
		children: disable(),
	},
} as Meta<ProseProps>;

const Template: Story<ProseProps> = (args) => {
	return <Prose {...args}>Hello, World</Prose>;
};

export const Default: Story<ProseProps> = Template.bind({});

export const ExtraSmall = Template.bind({});
ExtraSmall.args = {
	size: "xs",
};

export const Small = Template.bind({});
Small.args = {
	size: "sm",
};

export const Medium = Template.bind({});
Medium.args = {
	size: "md",
};

export const Large = Template.bind({});
Large.args = {
	size: "lg",
};

export const ExtraLarge = Template.bind({});
ExtraLarge.args = {
	size: "xl",
};
