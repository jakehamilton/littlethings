import { keyframes } from "@littlethings/css";

const grow = keyframes({
	from: {
		transform: "scale(0)",
		opacity: "0.1",
	},
	to: {
		transform: "scale(1)",
		opacity: "0.3",
	},
});

export default grow;
