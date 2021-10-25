import { Meta, Story } from "@storybook/preact";
import { ChevronDown, DollarSign, Eye, EyeOff, Gift } from "preact-feather";

import {
	action,
	boolean,
	disable,
	select,
	themeColor,
} from "../../../.storybook/controls";

import Input, { InputProps } from ".";
import { useEffect, useLayoutEffect, useRef, useState } from "preact/hooks";
import { useCSS } from "../..";
import { DynamicProps, WithDynamicProps } from "../Dynamic";
import usePopper from "../../hooks/usePopper";
import Surface from "../Surface";

export default {
	title: "Design System/Input",
	component: Input,
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
} as Meta<InputProps>;

const Template: Story<
	WithDynamicProps<"input" | "textarea" | "select", InputProps>
> = (args) => {
	return <Input {...args} />;
};

export const Default = Template.bind({});

export const Textarea = Template.bind({});
Textarea.args = {
	as: "textarea",
};

export const PrefixIcon: Story<InputProps> = (args) => {
	return <Input {...args} prefixIcon={<DollarSign />} />;
};

export const PostfixIcon: Story<InputProps> = (args) => {
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
		<Input
			{...args}
			postfixIcon={show ? <EyeOff /> : <Eye />}
			PostfixIconProps={{
				onClick: handleToggle,
				class: classes.postfixIcon,
			}}
		/>
	);
};

export const Select: Story<InputProps> = (args) => {
	const baseRef = useRef<HTMLDivElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);

	const popper = usePopper(baseRef, menuRef, {});

	const classes = useCSS(Select, ({ css, util }) => {
		return {
			root: css({}),
			input: css({}),
			menu: css({
				padding: `${util.space(2)}px`,
				borderRadius: `${util.round("md")}px`,
			}),
		};
	});

	return (
		<div>
			<Input
				{...args}
				as="select"
				classes={classes}
				prefixIcon={<Gift />}
				postfixIcon={<ChevronDown />}
				RootProps={{
					innerRef: baseRef,
				}}
			>
				<option>One</option>
				<option>Two</option>
			</Input>
			<Surface
				innerRef={menuRef}
				elevation="md"
				style={popper.styles.popper}
				class={classes.menu}
				{...popper.attributes.popper}
			>
				Hello, World!
			</Surface>
		</div>
	);
};
