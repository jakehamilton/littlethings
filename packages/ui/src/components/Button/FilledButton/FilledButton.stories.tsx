import { Meta, Story } from "@storybook/preact";
import { action } from "@storybook/addon-actions";

import {
	boolean,
	date,
	disable,
	object,
} from "../../../../.storybook/controls";

import FilledButton, { FilledButtonProps } from ".";

const DEFAULT_CHILDREN = "Click Me";

export default {
	title: "Design System/Button/Filled",
	component: FilledButton,
	args: {
		children: DEFAULT_CHILDREN,
		onClick: action("onClick"),
	},
	argTypes: {
		disabled: boolean({
			defaultValue: false,
			description: "Whether or not the button should be disabled.",
		}),
		children: disable(),
	},
} as Meta<FilledButtonProps>;

const Template = (args: FilledButtonProps) => <FilledButton {...args} />;

export const Default: Story = Template.bind({});
Default.parameters = {
	docs: {
		source: {
			code: `
import { Button } from "@littlethings/ui";

<Button variant="filled">${DEFAULT_CHILDREN}</Button>
`.trim(),
		},
	},
};

export const Small: Story<FilledButtonProps> = Template.bind({});
Small.args = {
	size: "sm",
};
Small.parameters = {
	docs: {
		source: {
			code: `
import { Button } from "@littlethings/ui";

<Button variant="filled" size="sm">${DEFAULT_CHILDREN}</Button>
`.trim(),
		},
	},
};

export const Medium: Story<FilledButtonProps> = Template.bind({});
Medium.args = {
	size: "md",
};
Medium.parameters = {
	docs: {
		source: {
			code: `
import { Button } from "@littlethings/ui";

<Button variant="filled" size="md">${DEFAULT_CHILDREN}</Button>
`.trim(),
		},
	},
};

export const Large: Story<FilledButtonProps> = Template.bind({});
Large.args = {
	size: "lg",
};
Large.parameters = {
	docs: {
		source: {
			code: `
import { Button } from "@littlethings/ui";

<Button variant="filled" size="lg">${DEFAULT_CHILDREN}</Button>
`.trim(),
		},
	},
};

export const ExtraLarge: Story<FilledButtonProps> = Template.bind({});
ExtraLarge.args = {
	size: "xl",
};
ExtraLarge.parameters = {
	docs: {
		source: {
			code: `
import { Button } from "@littlethings/ui";

<Button variant="filled" size="xl">${DEFAULT_CHILDREN}</Button>
`.trim(),
		},
	},
};
