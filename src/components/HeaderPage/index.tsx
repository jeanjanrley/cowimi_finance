import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import "./styles.scss";

interface HeaderProps {
	title: string;
}

export function HeaderPage({ title }: HeaderProps) {
	const navigate = useNavigate();

	const handleBack = () => {
		try {
			navigate("/");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="header-area">
			<div className="back-button" onClick={handleBack}>
				<BiArrowBack color="#fff" size={16} />
			</div>
			<div className="title-area">
				<h2>{title}</h2>
			</div>
		</div>
	);
}