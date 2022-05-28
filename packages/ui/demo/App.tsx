import Buttons from "./sections/Buttons";
import Header from "./sections/Header";
import Surfaces from "./sections/Surfaces";
import Loadings from "./sections/Loadings";
import TextInputs from "./sections/TextInputs";
import Selects from "./sections/Selects";
import Gap from "../src/components/Gap";

const App = (props) => {
	console.log(props);
	return (
		<div class={props.classes?.root}>
			<Header />
			<Surfaces />
			<Loadings />
			<Buttons />
			<TextInputs />
			<Selects />
			<Gap vertical size={10} />
		</div>
	);
};

export default App;
