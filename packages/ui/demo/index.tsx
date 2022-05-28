import { render } from "preact";
import { ThemeProvider } from "../src/contexts/Theme";
import CSSBase from "../src/components/CSSBase";
import App from "./App";

const Root = () => {
	return (
		<ThemeProvider>
			<CSSBase />
			<App />
		</ThemeProvider>
	);
};

render(<Root />, document.querySelector("#root"));
