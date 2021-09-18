import { Story } from "@storybook/preact";
import Loading, { LoadingProps } from ".";

export default {
	title: "Design System/Loading",
};

const Template = (args: LoadingProps) => <Loading {...args} />;

export const Default: Story = Template.bind({});
