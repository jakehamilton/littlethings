import { keyframes } from "@littlethings/css";

const spin = keyframes({
	from: {
		transform: "rotate(0)",
	},

	to: {
		transform: "rotate(360deg)",
	},
});

export default spin;
