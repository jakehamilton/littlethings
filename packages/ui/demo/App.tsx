import Buttons from "./sections/Buttons";
import Header from "./sections/Header";
import Surfaces from "./sections/Surfaces";
import Loadings from "./sections/Loadings";
import Gap from "../src/components/Gap";

const App = () => {
	return (
		<div>
			<Header />
			<Surfaces />
			<Loadings />
			<Buttons />
			<Gap vertical size={10} />
		</div>
	);
};

export default App;
