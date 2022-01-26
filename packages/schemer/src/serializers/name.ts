import { pascal } from "../util/formatting";

const serialize = (name: string) => {
	return name.split(".").map(pascal).join("");
};

export default serialize;
