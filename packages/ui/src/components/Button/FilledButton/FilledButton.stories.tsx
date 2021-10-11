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
		float: false,
	},
	argTypes: {
		disabled: boolean({
			defaultValue: false,
			description: "Whether or not the button should be disabled.",
		}),
		float: boolean({
			defaultValue: false,
			description: "Make the button float above the page.",
		}),
		children: disable(),
	},
} as Meta<FilledButtonProps>;

const Template: Story<FilledButtonProps> = (args: FilledButtonProps) => (
	<FilledButton {...args} />
);

export const Default = Template.bind({});
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

export const Floating = Template.bind({});
Floating.args = {
	float: true,
};
Floating.parameters = {
	docs: {
		source: {
			code: `
import { Button } from "@littlethings/ui";

<Button variant="filled" float>${DEFAULT_CHILDREN}</Button>
`.trim(),
		},
	},
};

export const Disabled = Template.bind({});
Disabled.args = {
	disabled: true,
};
Disabled.parameters = {
	docs: {
		source: {
			code: `
import { Button } from "@littlethings/ui";

<Button variant="filled" disabled>${DEFAULT_CHILDREN}</Button>
`.trim(),
		},
	},
};

export const Small = Template.bind({});
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

export const Medium = Template.bind({});
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

export const Large = Template.bind({});
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

export const ExtraLarge = Template.bind({});
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
