import { Timestamp } from "firebase/firestore";

export type TodoStatusTypes = "PAGO" | "PENDENTE" | "AGUARDANDO" | "RECEBIDO";
export type TodoType = "ENTRADA" | "SAIDA"

export interface TodoItemProps {
	id?: string;
	title: string;
	description?: string;
	value: number;
	vencimento: Timestamp;
	status: TodoStatusTypes;
	owner?: string;
	createdAt: Timestamp;
	tipo: TodoType;
}