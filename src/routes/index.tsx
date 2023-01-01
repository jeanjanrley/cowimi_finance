import { useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainContext } from "../contexts";
import { auth } from "../firebase";
import { AddItemPage } from "../pages/AddItem";
import { HomePage } from "../pages/Home";
import { LoginPage } from "../pages/Login";


export function MainRoutes() {
	const { user, setUser } = useContext(MainContext);

	useEffect(() => {
		const register = auth.onAuthStateChanged((user_state) => {
			setUser(user_state);
		});

		return () => {
			register();
		};
	}, [setUser]);



	return (
		<BrowserRouter>
			<Routes>
				{
					auth.currentUser ?
						<>
							<Route path="/" element={<HomePage />} />
							<Route path="addItem" element={<AddItemPage />} />
						</>
						:
						<Route path="/" element={<LoginPage />} />
				}
			</Routes>
		</BrowserRouter>
	);
}