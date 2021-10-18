import { Meta, Story } from "@storybook/preact";
import { action } from "@storybook/addon-actions";

import { Github } from "preact-feather";

import {
	boolean,
	date,
	disable,
	object,
	select,
	themeColor,
} from "../../../../.storybook/controls";

import IconButton, { IconButtonProps } from ".";

const DEFAULT_CHILDREN = "Click Me";

export default {
	title: "Design System/Button/Icon",
	component: IconButton,
	args: {
		children: DEFAULT_CHILDREN,
		onClick: action("onClick"),
		float: false,
		color: "primary",
	},
	argTypes: {
		color: themeColor("primary"),
		disabled: boolean({
			defaultValue: false,
			description: "Whether or not the button should be disabled.",
		}),
		loading: boolean({
			defaultValue: false,
			description: "Show a loading spinner on the button.",
		}),
		size: select({
			defaultValue: "md",
			options: ["sm", "md", "lg", "xl"],
		}),
		children: disable(),
	},
} as Meta<IconButtonProps>;

const Template: Story<IconButtonProps> = (args: IconButtonProps) => (
	<IconButton {...args}>
		<Github />
	</IconButton>
);

export const Default = Template.bind({});
Default.parameters = {
	docs: {
		source: {
			code: `
import { Button } from "@littlethings/ui";
import { Github } from "preact-feather";

<Button variant="icon">
	<Github />
</Button>
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
import { Github } from "preact-feather";

<Button variant="icon" disabled>
	<Github />
</Button>
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
import { Github } from "preact-feather";

<Button variant="icon" size="sm">
	<Github />
</Button>
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
import { Github } from "preact-feather";

<Button variant="icon" size="md">
	<Github />
</Button>
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
import { Github } from "preact-feather";

<Button variant="icon" size="lg">
	<Github />
</Button>
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
import { Github } from "preact-feather";

<Button variant="icon" size="xl">
	<Github />
</Button>
`.trim(),
		},
	},
};
