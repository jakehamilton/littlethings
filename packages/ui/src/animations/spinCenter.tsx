import { keyframes } from "@littlethings/css";

const spinCenter = keyframes({
	from: {
		transform: "translate(-50%, -50%) rotate(0)",
	},
	to: {
		transform: "translate(-50%, -50%) rotate(360deg)",
	},
});

export default spinCenter;
