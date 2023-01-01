import { MainContextProvider } from "./contexts";
import { MainRoutes } from "./routes";
import "./App.scss";

function App() {
	return (
		<MainContextProvider>
			<MainRoutes />
		</MainContextProvider>
	);
}

export default App;
