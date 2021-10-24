import { clsx } from "@littlethings/css";
import { useState } from "preact/hooks";
import TransitionGroup, { TransitionGroupProps } from ".";
import useCSS from "../../hooks/useCSS";
import Button from "../Button";
import Gap from "../Gap";
import Transition, { TransitionStatus } from "../Transition";

export default {
	title: "Utility/TransitionGroup",
	component: TransitionGroup,
};

const Template = (args: TransitionGroupProps) => {
	const [items, setItems] = useState(Array.from({ length: 10 }, (x, i) => i));

	const classes = useCSS(Template, ({ css }) => {
		return {
			item: css({
				display: "flex",
				transition: "opacity 1s linear",
				opacity: "1",
			}),
			entering: css({
				opacity: "1",
			}),
			entered: css({
				opacity: "1",
			}),
			exiting: css({
				opacity: "0",
			}),
			exited: css({
				opacity: "0",
			}),
		};
	});

	const remove = (i: number) => {
		setItems((prevItems) => {
			return prevItems.filter((x, index) => index !== i);
		});
	};

	return (
		<div>
			<TransitionGroup {...args}>
				{items.map((item, i) => (
					<Transition key={item} timeout={1000} enter exit appear>
						{(status) => (
							<>
								<Button
									variant="outlined"
									onClick={() => remove(i)}
									classes={{
										root: clsx(
											classes.item,
											status ===
												TransitionStatus.UNMOUNTED
												? null
												: classes[status]
										),
									}}
								>
									Remove Item #{item}
								</Button>
								{i !== items.length ? <Gap /> : null}
							</>
						)}
					</Transition>
				))}
			</TransitionGroup>
		</div>
	);
};

export const Default = Template.bind({});
