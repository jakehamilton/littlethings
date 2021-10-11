import { Meta, Story } from "@storybook/preact";
import { action } from "@storybook/addon-actions";

import {
	boolean,
	date,
	disable,
	object,
} from "../../../../.storybook/controls";

import OutlinedButton, { OutlinedButtonProps } from ".";
import ButtonBase from "../../ButtonBase";

const DEFAULT_CHILDREN = "Click Me";

export default {
	title: "Design System/Button/Outlined",
	component: OutlinedButton,
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
} as Meta<OutlinedButtonProps>;

const Template: Story<OutlinedButtonProps> = (args) => (
	<OutlinedButton {...args} />
);

export const Default = Template.bind({});
Default.parameters = {
	docs: {
		source: {
			code: `
import { Button } from "@littlethings/ui";

<Button variant="outlined">${DEFAULT_CHILDREN}</Button>
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

<Button variant="outlined" disabled>${DEFAULT_CHILDREN}</Button>
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

<Button variant="outlined" size="sm">${DEFAULT_CHILDREN}</Button>
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

<Button variant="outlined" size="md">${DEFAULT_CHILDREN}</Button>
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

<Button variant="outlined" size="lg">${DEFAULT_CHILDREN}</Button>
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

<Button variant="outlined" size="xl">${DEFAULT_CHILDREN}</Button>
`.trim(),
		},
	},
};
