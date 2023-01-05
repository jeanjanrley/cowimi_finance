import { useContext } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { MainContext } from "../../contexts";
import { useQueries } from "../../hooks/useQueries";
import { Button } from "../Button";
import "./styles.scss";

interface HeaderProps {
	title: string;
}

export function HeaderPage({ title }: HeaderProps) {
	const { empresa, setEmpresa } = useContext(MainContext);
	const { deleteCompany } = useQueries();
	const navigate = useNavigate();

	const handleBack = () => {
		try {
			navigate("/");
		} catch (error) {
			console.log(error);
		}
	};

	const handleDeleteCompany = async () => {
		try {
			if (!empresa) {
				Swal.fire("Erro", "Nenhuma empresa encontrada!", "error");
				return;
			}

			if (empresa.id) {
				const result = await deleteCompany({ empresaId: empresa.id });
				if (result === "DELETED") {
					navigate("/");
					setEmpresa(null);
				}
			}

		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="header-area">
			<Button className="back-button" onClick={handleBack}>
				<BiArrowBack color="#fff" size={16} />
			</Button>
			<div className="title-area">
				<h2>{title}</h2>
			</div>
			<div className="trash-button" onClick={handleDeleteCompany}>
				<AiOutlineDelete color="#fff" size={16} />
			</div>
		</div>
	);
}