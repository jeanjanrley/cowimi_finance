import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Swal from "sweetalert2";
import { CompanyProps } from "../../types";
import { fisrtUpper } from "../../utils/firstUpper";

interface EmpresaComponentProps {
	empresa?: CompanyProps;
}

export function EmpresaComponent({ empresa }: EmpresaComponentProps) {
	const navigate = useNavigate();

	const handleAddCompany = () => {
		try {
			navigate("addCompany");
		}
		catch (error) {
			console.log(error);
		}
	};

	const handleEditCompany = () => {
		try {
			if (!empresa) {
				Swal.fire("Erro", "Nenhum empresa selecionada!", "error");
				return;
			}
			navigate("addCompany", { state: { company: empresa } });
		}
		catch (error) {
			console.log(error);
		}
	};

	return (
		<EmpresaComponentStyles onClick={() => empresa ? handleEditCompany() : handleAddCompany()}>
			{
				empresa
					?
					<div className="content-area">
						<h2 className="header-title">{fisrtUpper("PRIME CONSULTORIA MÉDICA E ASSOCIADOS")}</h2>
						<h3 className="header-sub-title">18.860.821/0001-00</h3>
					</div>
					:
					<h2 className="no-company">
						Adicionar empresa
					</h2>
			}
		</EmpresaComponentStyles>
	);

}

const EmpresaComponentStyles = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	border-radius: 4px;
	padding: 8px;
	background: #2d3e50;
	cursor: pointer;
	transition: all ease-in-out 0.1s;
	outline: 1px solid #2d3e50;

	&:hover{
		outline: 1px solid #32AA63;
		background: #374555;
	}

	.content-area{
		display: flex;
		flex-direction: column;

		.header-title,
		.header-sub-title{
			line-height: 1;
			font-weight: 400;
		}

		.header-title{
			font-size: 18px;
		}

		.header-sub-title{
			font-size: 14px;
			color: #ddd;
		}
	}

	.no-company{
		font-size: 20px;
		text-align: center;
	}
`;