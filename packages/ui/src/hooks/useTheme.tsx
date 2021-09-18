import { useContext } from "preact/hooks";
import { ThemeContext, ThemeContextValue } from "../contexts/ThemeProvider";

const useTheme = (): ThemeContextValue => {
	const value = useContext(ThemeContext);

	if (value === undefined) {
		throw new Error(
			"useTheme() couldn't find the theme context, did you forget to wrap your application in a ThemeProvider?"
		);
	}

	return value;
};

export default useTheme;
