import { useState } from "preact/hooks";
import Transition, { TransitionProps } from ".";
import Button from "../Button";
import Gap from "../Gap";

export default {
	title: "Utility/Transition",
	component: Transition,
};

const Template = (args: TransitionProps) => {
	const [checked, setChecked] = useState(false);

	const handleToggle = () => {
		setChecked((state) => !state);
	};

	return (
		<div>
			<Button variant="text" onClick={handleToggle}>
				Toggle
			</Button>
			<Gap />
			<Transition in={checked} enter exit timeout={3000}>
				{(status) => <>Current Status: {status}</>}
			</Transition>
		</div>
	);
};

export const Default = Template.bind({});
