import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/preact";
import { Github } from "preact-feather";

import Button, { ButtonProps } from ".";

import {
	boolean,
	color,
	disable,
	select,
	themeColor,
} from "../../../.storybook/controls";
import { WithChildren } from "../../types/preact";

const DEFAULT_CHILDREN = "Click Me";

export default {
	title: "Design System/Button",
	component: Button,
	args: {
		children: DEFAULT_CHILDREN,
		onClick: action("onClick"),
		disabled: false,
		float: false,
		loading: false,
		size: "md",
	},
	argTypes: {
		variant: select({
			defaultValue: "filled",
			options: ["filled", "text", "outlined", "icon"],
		}),
		disabled: boolean({
			defaultValue: false,
			description: "Whether the button is disabled or not.",
		}),
		float: boolean({
			defaultValue: false,
			description:
				"Make the button float above the page when using the filled variant.",
		}),
		loading: boolean({
			defaultValue: false,
			description: "Show a loading spinner on the button.",
		}),
		size: select({
			defaultValue: "md",
			options: ["sm", "md", "lg", "xl"],
		}),
		color: themeColor("primary"),
		children: disable(),
	},
} as Meta<ButtonProps>;

const Template: Story<WithChildren<ButtonProps>> = (args) => (
	<Button {...args}>
		{args.variant === "icon" ? <Github /> : args.children}
	</Button>
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

export const Loading = Template.bind({});
Loading.args = {
	loading: true,
};
Loading.parameters = {
	docs: {
		source: {
			code: `
import { Button } from "@littlethings/ui";

<Button loading>${DEFAULT_CHILDREN}</Button>
`.trim(),
		},
	},
};
