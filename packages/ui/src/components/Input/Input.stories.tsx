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
import {
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "preact/hooks";
import { useCSS } from "../..";
import Dynamic, {
	DynamicComponent,
	DynamicProps,
	PropsFromAs,
	WithDynamicProps,
} from "../Dynamic";
import usePopper from "../../hooks/usePopper";
import Surface from "../Surface";
import { Modifier } from "@popperjs/core";
import { toChildArray, isValidElement } from "preact";
import Prose from "../Prose";
import { clsx } from "@littlethings/css";

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
	const [isVisible, setIsVisible] = useState(false);

	const baseRef = useRef<HTMLDivElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);

	const modifier = useMemo(() => {
		return {
			name: "sameWidth",
			enabled: true,
			phase: "beforeWrite",
			requires: ["computeStyles"],
			fn({ state }) {
				state.styles.popper.width = `${state.rects.reference.width}px`;
			},
			effect({ state }) {
				state.elements.popper.style.width = `${
					(state.elements.reference as any).offsetWidth
				}px`;
			},
		} as Modifier<"sameWidth", {}>;
	}, []);

	const popper = usePopper(baseRef, menuRef, {
		modifiers: [modifier],
	});

	const handleRootClick = (event: MouseEvent) => {
		baseRef.current?.focus();

		setIsVisible((prev) => !prev);

		event.stopPropagation();

		setTimeout(() => {
			const handler = (event: MouseEvent) => {
				setIsVisible(false);

				window.removeEventListener("click", handler);
			};

			window.addEventListener("click", handler);
		});
	};

	const handleInputClick = (event: MouseEvent) => {
		event.preventDefault();
		(event.target as HTMLElement).blur();
	};

	const classes = useCSS(Select, ({ css, util }) => {
		const backgroundColor = util.color("background");

		return {
			root: css({
				cursor: "pointer",
			}),
			input: css({
				display: "flex",
				alignItems: "center",
			}),
			menu: css({
				padding: `${util.space(2)}px`,
				borderRadius: `${util.round("md")}px`,
			}),
			postfixIcon: css({
				color: `${backgroundColor.text} !important`,
				background: `${backgroundColor.light} !important`,
			}),
			hidden: css({
				visibility: "hidden",
				opacity: "0",
				pointerEvents: "none",
			}),
		};
	});

	const CustomInput: DynamicComponent<{}, "div"> = ({
		children,
		...props
	}) => {
		const options = toChildArray(children);

		const selected = useState(
			isValidElement(options[0])
				? (options[0].props as PropsFromAs<"option">).value
				: options[0]
		);

		const getOption = (value) => {
			return (
				options.find((option) =>
					isValidElement(option)
						? (option.props as PropsFromAs<"option">).value ===
						  value
						: option === value
				) ?? "Select"
			);
		};

		return (
			// @ts-ignore
			<Dynamic as="div" {...props}>
				<Prose size="sm">{getOption(selected)}</Prose>
				<select aria-hidden class={classes.hidden} value={selected}>
					{children}
				</select>
			</Dynamic>
		);
	};

	return (
		<div>
			<Input
				{...args}
				as={CustomInput}
				classes={classes}
				prefixIcon={<Gift />}
				PostfixIconProps={{
					class: classes.postfixIcon,
				}}
				postfixIcon={<ChevronDown />}
				RootProps={{
					tabIndex: 0,
					innerRef: baseRef,
					onClick: handleRootClick,
				}}
				// @ts-ignore
				onClick={handleInputClick}
			>
				<option value="one">One</option>
				<option value="two">Two</option>
			</Input>
			{isVisible ? (
				<Surface
					innerRef={menuRef}
					elevation="md"
					style={popper.styles.popper}
					class={classes.menu}
					{...popper.attributes.popper}
				>
					Hello, World!
				</Surface>
			) : null}
		</div>
	);
};
