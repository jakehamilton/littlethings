import { useState } from "preact/hooks";
import Transition, { TransitionProps } from ".";

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
			<input type="checkbox" onClick={handleToggle}>
				Toggle
			</input>
			<Transition in={checked} enter exit timeout={3000}>
				{(status) => <>{status}</>}
			</Transition>
		</div>
	);
};

export const Default = Template.bind({});
