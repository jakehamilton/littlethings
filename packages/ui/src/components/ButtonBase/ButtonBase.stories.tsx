import { action } from "@storybook/addon-actions";

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

const Template = (args: ButtonBaseProps) => <ButtonBase {...args} />;

export const Default = Template.bind({});
