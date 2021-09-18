import { action } from "@storybook/addon-actions";

import Button, { ButtonProps } from ".";

const DEFAULT_CHILDREN = "Click Me";

export default {
	title: "Design System/Button",
	component: Button,
	args: {
		children: DEFAULT_CHILDREN,
		onClick: action("onClick"),
	},
};

const Template = (args: ButtonProps) => <Button {...args} />;

export const Default = Template.bind({});
(Default as any).parameters = {
	docs: {
		source: {
			code: `
import { Button } from "@littlethings/ui";

<Button>${DEFAULT_CHILDREN}</Button>
`.trim(),
		},
	},
};
