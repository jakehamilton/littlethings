import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/preact";

import Button, { ButtonProps } from ".";
import { boolean, disable } from "../../../.storybook/controls";

const DEFAULT_CHILDREN = "Click Me";

export default {
	title: "Design System/Button",
	component: Button,
	args: {
		children: DEFAULT_CHILDREN,
		onClick: action("onClick"),
		disabled: false,
		float: false,
	},
	argTypes: {
		disabled: boolean({
			defaultValue: false,
			description: "Whether the button is disabled or not.",
		}),
		float: boolean({
			defaultValue: false,
			description:
				"Make the button float above the page when using the filled variant.",
		}),
		children: disable(),
	},
} as Meta<ButtonProps>;

const Template: Story<ButtonProps> = (args: ButtonProps) => (
	<Button {...args} />
);

export const Default = Template.bind({});
Default.parameters = {
	docs: {
		source: {
			code: `
import { Button } from "@littlethings/ui";

<Button>${DEFAULT_CHILDREN}</Button>
`.trim(),
		},
	},
};
