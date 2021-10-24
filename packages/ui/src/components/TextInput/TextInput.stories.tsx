import { Meta, Story } from "@storybook/preact";
import { DollarSign, Eye, EyeOff } from "preact-feather";

import {
	action,
	boolean,
	disable,
	select,
	themeColor,
} from "../../../.storybook/controls";

import TextInput, { TextInputProps } from ".";
import { useState } from "preact/hooks";
import { useCSS } from "../..";

export default {
	title: "Design System/TextInput",
	component: TextInput,
	args: {
		color: "background.light",
		focus: "primary",
		border: "background.dark",
		disabled: false,
	},
	argTypes: {
		as: select({
			defaultValue: "input",
			options: ["input", "textarea"],
		}),
		color: themeColor("background.light"),
		focus: themeColor("primary"),
		border: themeColor("background.dark"),
		onInput: action("onInput"),
		disabled: boolean({
			defaultValue: false,
		}),
	},
} as Meta<TextInputProps>;

const Template: Story<TextInputProps> = (args) => {
	return <TextInput {...args} />;
};

export const Default = Template.bind({});

export const Textarea = Template.bind({});
Textarea.args = {
	as: "textarea",
};

export const PrefixIcon: Story<TextInputProps> = (args) => {
	return <TextInput {...args} prefixIcon={<DollarSign />} />;
};

export const PostfixIcon: Story<TextInputProps> = (args) => {
	const [show, setShow] = useState(false);

	const handleToggle = () => {
		if (!args.disabled) {
			setShow((prev) => !prev);
		}
	};

	const classes = useCSS(
		PostfixIcon,
		({ css }) => {
			return {
				postfixIcon: css({
					cursor: args.disabled ? "initial" : "pointer",
				}),
			};
		},
		[args.disabled]
	);

	return (
		<TextInput
			{...args}
			postfixIcon={show ? <EyeOff /> : <Eye />}
			PostfixIconProps={{
				onClick: handleToggle,
				class: classes.postfixIcon,
			}}
		/>
	);
};
