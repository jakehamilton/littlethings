import { action } from "@storybook/addon-actions";
import { Story } from "@storybook/preact";
import { ArrowRight, Heart } from "preact-feather";

import ButtonBase, { ButtonBaseProps } from ".";

const DEFAULT_CHILDREN = "Click Me";

export default {
	title: "Utility/ButtonBase",
	component: ButtonBase,
	args: {
		children: DEFAULT_CHILDREN,
		onClick: action("onClick"),
	},
};

const Template: Story<ButtonBaseProps> = (args) => <ButtonBase {...args} />;

export const Default = Template.bind({});

export const PrefixIcon: Story<ButtonBaseProps> = (args) => (
	<ButtonBase {...args} prefixIcon={<Heart size={16} />} />
);

export const PostfixIcon: Story<ButtonBaseProps> = (args) => (
	<ButtonBase {...args} postfixIcon={<ArrowRight size={16} />} />
);
