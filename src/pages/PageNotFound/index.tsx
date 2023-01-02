import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.scss";

export function PageNotFound() {
	const navigate = useNavigate();

	useEffect(() => {
		const timer = setTimeout(() => {
			navigate("/");
		}, 5000);

		return () => clearTimeout(timer);
	}, [navigate]);

	return (
		<div className="page page-not-found">
			<h2>Página não encontrada!</h2>
			<p>Você será redirecionado de volta!</p>
		</div>
	);
}