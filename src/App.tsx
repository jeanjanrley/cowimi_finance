import { MainContextProvider } from "./contexts";
import { MainRoutes } from "./routes";
import "./App.scss";
import { HashRouter } from "react-router-dom";

function App() {
	return (
		<MainContextProvider>
			<HashRouter>
				<MainRoutes />
			</HashRouter>
		</MainContextProvider>
	);
}

export default App;
