import { Story } from "@storybook/preact";
import Loading, { LoadingProps } from ".";

export default {
	title: "Design System/Loading",
};

const Template: Story<LoadingProps> = (args: LoadingProps) => (
	<Loading {...args} />
);

export const Default = Template.bind({});
Default.args = {
	size: "md",
	color: "primary",
};
