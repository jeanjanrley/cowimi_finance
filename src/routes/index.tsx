import { useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainContext } from "../contexts";
import { auth } from "../firebase";
import { AddCompanyPage } from "../pages/addCompany";
import { AddItemPage } from "../pages/AddItem";
import { HomePage } from "../pages/Home";
import { LoginPage } from "../pages/Login";
import { PageNotFound } from "../pages/PageNotFound";


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
		<Routes>
			<Route path="*" element={<PageNotFound />} />
			{
				user ?
					<>
						<Route path="/" element={<HomePage />} />
						<Route path="addItem" element={<AddItemPage />} />
						<Route path="addCompany" element={<AddCompanyPage />} />
					</>
					:
					<>
						<Route path="/" element={<LoginPage />} />
					</>
			}
		</Routes>
	);
}