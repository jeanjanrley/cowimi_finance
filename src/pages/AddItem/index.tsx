import { FormHandles, SubmitHandler } from "@unform/core";
import { Form } from "@unform/web";
import { useContext, useEffect, useRef, useState } from "react";
import { useQueries } from "../../hooks/useQueries";
import "./styles.scss";
import * as Yup from "yup";
import { TodoItemProps, TodoStatusTypes, TodoType, ValueTypes } from "../../types";
import { Input } from "../../components/Input";
import { Timestamp } from "firebase/firestore";
import { cleanObject } from "../../utils/cleanObject";
import { useNavigate, useLocation } from "react-router-dom";
import { confirmMiddleware } from "../../utils/middlewares";
import { MainContext } from "../../contexts";
import Swal from "sweetalert2";
import { selectStyles } from "../../utils/selectStyles";
import { Select } from "../../components/Select";
import { SelectInstance, GroupBase } from "react-select";
import { Button } from "../../components/Button";

export function AddItemPage() {
	const { user, optionsEmpresas, setEmpresa, empresa, empresas } = useContext(MainContext);
	const formRef = useRef<FormHandles>(null);
	const [item, setItem] = useState<TodoItemProps | null>(null);
	const [status, setStatus] = useState<TodoStatusTypes>("PENDENTE");
	const [tipo, setTipo] = useState<TodoType>("SAIDA");
	const { createItem, editItem } = useQueries();
	const navigate = useNavigate();
	const { state } = useLocation();
	const selectRef = useRef<SelectInstance<ValueTypes, false, GroupBase<ValueTypes>> | null>(null);

	useEffect(() => {
		try {
			if (state && state.item) {
				const { item } = state as { item: TodoItemProps };
				setItem(item ?? null);


				const vencimento = new Date(item.vencimento.seconds * 1000).toISOString().split("T")[0];

				formRef.current?.setData({
					...item,
					vencimento: vencimento,
					empresa: empresas?.find(empresa => empresa?.id === item?.empresa)?.nomeFantasia ?? "",
				});

				setStatus(item.status);
				setTipo(item.tipo);
			}
		} catch (error) {
			console.log(error);
		}
	}, [empresas, state]);

	const comeBack = () => {
		try {
			formRef.current?.reset();
			setStatus("PENDENTE");
			setTipo("SAIDA");
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
				title: Yup.string()
					.required("O titulo é obrigatório"),
				value: Yup.string()
					.required("O valor é obrigatório"),
				vencimento: Yup.string()
					.required("O vencimento é obrigatório"),
			}); "";

			await schema.validate(data, {
				abortEarly: false,
			});

			// Validation passed
			const newItem = cleanObject<TodoItemProps>({
				...data,
				value: parseFloat(data.value),
				vencimento: Timestamp.fromDate(new Date(`${data.vencimento}T00:00:00`)),
				status: status,
				tipo: tipo,
				empresa: empresa?.id
			});

			// Verifica se edita ou salva o item
			const result = await confirmMiddleware();
			if (!result) {
				return;
			}

			if (item) {
				newItem.updatedAt = Timestamp.now();
				newItem.updatedBy = user?.uid;

				item.id && await editItem({ itemId: item.id, item: newItem });
			} else {
				newItem.createdAt = Timestamp.now();

				if (user?.uid) {
					newItem.owner = user?.uid;
				}

				await createItem({ item: newItem });
			}

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
					<h2>{item ? "Editar Item" : "Adicionar Item"}</h2>
				</div>
				<Form
					onSubmit={handleSubmit}
					ref={formRef}
					className="form-area"
				>
					<div className="select-area">
						<label htmlFor="empresa">Empresa</label>
						<Select
							name="empresa"
							selectRef={selectRef}
							id="empresa"
							placeholder="Selecione uma empresa"
							options={optionsEmpresas ?? []}
							onChange={event => setEmpresa(event?.value ?? null)}
							styles={selectStyles}
							defaultValue={optionsEmpresas?.[0]}
							isClearable
						/>
					</div>
					<Input
						name="title"
						label="Titulo"
						placeholder="Ex: Coelba"
					/>
					<Input
						name="description"
						label="Descrição"
						placeholder="Ex: Pago com atraso pois o banco estava fechado."
					/>
					<Input
						name="value"
						label="Valor"
						placeholder="Valor em R$"
						type="number"
						pattern="[0-9]+([,\.][0-9]+)?"
						min="0"
						step="any"
					/>
					<Input
						name="vencimento"
						label="Data de vencimento"
						type="date"
					/>
					<div className="container-box">
						<label>Tipo de transação</label>
						<div className="radios-box">
							<div className="input-box">
								<label htmlFor="entrada">Entrada</label>
								<input
									id="entrada"
									name="tipo"
									type="radio"
									value="ENTRADA"
									checked={tipo === "ENTRADA"}
									onChange={event => setTipo(event.target.value as TodoType)}
								/>
							</div>
							<div className="input-box">
								<label htmlFor="saida">Saida</label>
								<input
									id="saida"
									name="tipo"
									type="radio"
									value="SAIDA"
									checked={tipo === "SAIDA"}
									onChange={event => setTipo(event.target.value as TodoType)}
								/>
							</div>
						</div>
					</div>
					{
						tipo === "SAIDA" ?
							<div className="container-box">
								<label>Status de pagamento</label>
								<div className="radios-box">
									<div className="input-box">
										<label htmlFor="pago">Pago</label>
										<input
											id="pago"
											name="status"
											type="radio"
											value="PAGO"
											checked={status === "PAGO"}
											onChange={event => setStatus(event.target.value as TodoStatusTypes)}
										/>
									</div>
									<div className="input-box">
										<label htmlFor="pendente">Pendente</label>
										<input
											id="pendente"
											name="status"
											type="radio"
											value="PENDENTE"
											checked={status === "PENDENTE"}
											onChange={event => setStatus(event.target.value as TodoStatusTypes)}
										/>
									</div>
								</div>
							</div>
							:
							<div className="container-box">
								<label>Status de pagamento</label>
								<div className="radios-box">
									<div className="input-box">
										<label htmlFor="pago">Recebido</label>
										<input
											id="pago"
											name="status"
											type="radio"
											value="RECEBIDO"
											checked={status === "RECEBIDO"}
											onChange={event => setStatus(event.target.value as TodoStatusTypes)}
										/>
									</div>
									<div className="input-box">
										<label htmlFor="pendente">Aguardando</label>
										<input
											id="pendente"
											name="status"
											type="radio"
											value="AGUARDANDO"
											checked={status === "AGUARDANDO"}
											onChange={event => setStatus(event.target.value as TodoStatusTypes)}
										/>
									</div>
								</div>
							</div>
					}
					<Button>Salvar</Button>
				</Form>
			</div>
		</div>
	);
}