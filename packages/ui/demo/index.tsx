import { render } from "preact";
import { ThemeProvider } from "../src/contexts/Theme";
import CSSBase from "../src/components/CSSBase";
import App from "./App";

render(
	<ThemeProvider mode="dark">
		<CSSBase />
		<App />
	</ThemeProvider>,
	document.querySelector("#root")
);
