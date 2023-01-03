import { Timestamp } from "firebase/firestore";

// tipagem do valor uma opção do react-select
export interface ValueTypes<referencia = unknown | any> {
	label: referencia | string | number;
	value: referencia;
}

export type TodoStatusTypes = "PAGO" | "PENDENTE" | "AGUARDANDO" | "RECEBIDO";
export type TodoType = "ENTRADA" | "SAIDA"

export interface TodoItemProps {
	id?: string;
	title: string;
	description?: string;
	value: number;
	vencimento: Timestamp;
	status: TodoStatusTypes;
	tipo: TodoType;
	owner?: string;
	createdAt?: Timestamp;
	updatedAt?: Timestamp;
	updatedBy?: string;
}

interface EnderecoProps {
	cep?: string;
	uf?: string;
	cidade?: string;
	bairro?: string;
	rua?: string;
	numero?: string;
}

export interface CompanyProps extends EnderecoProps {
	id?: string;
	nomeFantasia: string;
	razaoSocial: string;
	cnpj: string;
	owner?: string;
	createdAt: Timestamp;
	updatedAt?: Timestamp;
	updatedBy?: string;
}