import { User } from "firebase/auth";
import { createContext, Dispatch, SetStateAction, useState } from "react";
import { CompanyProps, TodoItemProps } from "../types";
import { useEffect } from "react";

interface MainContextProps {
	user: User | null;
	setUser: Dispatch<SetStateAction<User | null>>;
	items: TodoItemProps[] | null;
	setItems: Dispatch<SetStateAction<TodoItemProps[] | null>>;
	empresa: CompanyProps | null;
	setEmpresa: Dispatch<SetStateAction<CompanyProps | null>>
	empresas: CompanyProps[] | null;
	setEmpresas: Dispatch<SetStateAction<CompanyProps[] | null>>
}

export const MainContext = createContext<MainContextProps>({} as MainContextProps);

export function MainContextProvider({ children }: { children: React.ReactNode; }) {
	const [items, setItems] = useState<TodoItemProps[] | null>(null);
	const [user, setUser] = useState<User | null>(null);
	const [empresa, setEmpresa] = useState<CompanyProps | null>(null);
	const [empresas, setEmpresas] = useState<CompanyProps[] | null>(null);

	useEffect(() => {
		try {
			if (!user) {
				setItems(null);
			}
		} catch (error) {
			console.log(error);
		}
	}, [user]);

	return (
		<MainContext.Provider value={{ items, setItems, user, setUser, empresa, setEmpresa, empresas, setEmpresas }}>
			{children}
		</MainContext.Provider>
	);
}