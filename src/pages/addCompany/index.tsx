import { FormHandles, SubmitHandler } from "@unform/core";
import { Form } from "@unform/web";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useQueries } from "../../hooks/useQueries";
import "./styles.scss";
import * as Yup from "yup";
import { CompanyProps, TodoItemProps, TodoStatusTypes, TodoType } from "../../types";
import { Input } from "../../components/Input";
import { Timestamp, arrayUnion } from "firebase/firestore";
import { cleanObject } from "../../utils/cleanObject";
import { useNavigate, useLocation } from "react-router-dom";
import { confirmMiddleware } from "../../utils/middlewares";
import { MainContext } from "../../contexts";
import axios from "axios";
import { timeStamp } from "console";
import { Button } from "../../components/Button";

export function AddCompanyPage() {
	const { user, setEmpresas } = useContext(MainContext);
	const formRef = useRef<FormHandles>(null);
	const { createCompany, editCompany, getCompanys } = useQueries();
	const navigate = useNavigate();
	const { state } = useLocation();
	const [cnpj, setCnpj] = useState("");
	const [company, setCompany] = useState<CompanyProps | null>(null);

	/**Consulta os dados do CNPJ */
	const fetchCnpj = useCallback(async () => {
		try {
			const replacedCNPJ: string = cnpj.replace(/[^0-9]/g, "");
			if (replacedCNPJ.length === 14) {
				const result = await axios.get(`https://brasilapi.com.br/api/cnpj/v1/${replacedCNPJ}`);
				const { data } = result;
				console.log(data);
				if (data) {
					const company = {
						nomeFantasia: data.nome_fantasia,
						razaoSocial: data.razao_social,
						cep: data.cep,
						uf: data.uf,
						cidade: data.municipio,
						bairro: data.bairro,
						rua: data.logradouro,
						numero: data.numero,
					};

					formRef.current?.setData({
						...company,
						cnpj: cnpj,
					});
				}
			}
		}
		catch (error) {
			console.log(error);
		}
	}, [cnpj]);

	useEffect(() => {
		fetchCnpj();
	}, [fetchCnpj]);

	useEffect(() => {
		try {
			if (state && state.item) {
				const { company } = state as { company: CompanyProps };
				setCompany(company ?? null);
				formRef.current?.setData({
					...company
				});
			}
		} catch (error) {
			console.log(error);
		}
	}, [state]);

	const comeBack = () => {
		try {
			formRef.current?.reset();
			navigate("/");
		} catch (error) {
			console.log(error);
		}
	};

	const handleSubmit: SubmitHandler<any> = async data => {
		try {
			// Remove all previous errors
			formRef.current?.setErrors({});

			const schema = Yup.object().shape({
				cnpj: Yup.string()
					.required("Este campo é obrigatório"),
				nomeFantasia: Yup.string()
					.required("Este campo é obrigatório"),
				razaoSocial: Yup.string()
					.required("Este campo é obrigatório"),
			}); "";

			await schema.validate(data, {
				abortEarly: false,
			});

			// Validation passed
			const newCompany = cleanObject<CompanyProps>({
				...data
			});

			// Pede a confirmação do usuário antes de salvar
			const result = await confirmMiddleware();
			if (!result) {
				return;
			}

			if (company) {
				newCompany.updatedAt = Timestamp.now();
				newCompany.updatedBy = user?.uid;

				company.id && await editCompany({ companyId: company.id, company: newCompany });
			} else {
				if (user?.uid) {
					newCompany.users = [user.uid];
					newCompany.owner = user?.uid;
				}

				newCompany.createdAt = Timestamp.now();
				await createCompany({ company: newCompany });
			}

			user && user.uid && getCompanys({ userId: user?.uid })
				.then(result => {
					setEmpresas(result ?? null);
				})
				.catch((error) => {
					console.log(error);
					setEmpresas(null);
				});

			comeBack();
		} catch (error) {
			if (error instanceof Yup.ValidationError) {
				const errorMessages: any = {};
				error.inner.forEach(error => {
					errorMessages[error.path !== undefined ? error.path : ""] = error.message;
				});
				formRef.current?.setErrors(errorMessages);
				console.log(errorMessages);
			} else {
				console.log("Error no envio do formulário: ", error);
			}
		}
	};

	return (
		<div className="add-item-page page">
			<div className="container-area">
				<div className="header-area">
					<h2>{company ? "Editar Empresa" : "Adicionar Empresa"}</h2>
				</div>
				<Form
					onSubmit={handleSubmit}
					ref={formRef}
					className="form-area"
				>
					<Input
						name="cnpj"
						label="CNPJ"
						placeholder="Ex: 00.000.000/0000-00"
						onChange={event => setCnpj(event.target.value)}
					/>
					<Input
						name="nomeFantasia"
						label="Nome fantasia"
						placeholder="Ex: Petrobras"
					/>
					<Input
						name="razaoSocial"
						label="Razão social"
						placeholder="Ex: Petroleo Brasileiro S.A"
					/>
					<Input
						name="cep"
						label="CEP"
						placeholder="Ex: 00.000.000"
					/>
					<Input
						name="uf"
						label="Estado (UF)"
						placeholder="Ex: Bahia"
					/>
					<Input
						name="cidade"
						label="Cidade"
						placeholder="Ex: São Paulo"
					/>
					<Input
						name="bairro"
						label="Bairro"
						placeholder="Ex: Centro"
					/>
					<Input
						name="rua"
						label="Rua (Logradouro)"
						placeholder="Ex: Av. Eixo Urbano"
					/>
					<Input
						name="numero"
						label="Numero"
						placeholder="Ex: 117"
					/>
					<Button>Salvar</Button>
				</Form>
			</div>
		</div>
	);
}