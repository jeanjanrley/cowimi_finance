import Swal from "sweetalert2";
import { validate } from "email-validator";
import { auth, db } from "../firebase";
import { browserLocalPersistence, signInWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDocs, limit, query, Timestamp, updateDoc, where } from "firebase/firestore";
import { CompanyProps, TodoItemProps } from "../types";
import { useCallback } from "react";
import { MainContext } from "../contexts";
import { useContext } from "react";
import { confirmMiddleware } from "../utils/middlewares";

export function useQueries() {
	const { user, empresa } = useContext(MainContext);

	/**Middleware que verifica se está tudo ok para fazer login */
	const logginMiddleware = ({ email, password }: { email: string; password: string }) => {
		try {
			if (!validate(email)) {
				Swal.fire("Erro", "E-mail inválido!", "error");
				return;
			}

			if (email.length <= 0 || password.length <= 0) {
				Swal.fire("Erro", "Você precisa preencher seu login e senha corretamente!", "error");
				return;
			}

			if (password.length < 6) {
				Swal.fire("Erro", "Usuário ou senha icorreto!", "error");
				return;
			}
			return true;
		}
		catch (error) {
			console.log(error);
		}
	};

	/**Faz o login do usuário */
	const fazerLogin = async ({ email, password }: { email: string; password: string }) => {
		try {
			if (!logginMiddleware({ email, password })) {
				return;
			}

			await auth.setPersistence(browserLocalPersistence)
				.then(async () => {
					return signInWithEmailAndPassword(auth, email, password);
				})
				.catch((error) => {
					console.log(error);
					throw error;
				}
				);
		} catch (error) {
			console.log(error);
			const { code } = error as any;
			switch (code) {
				case "auth/wrong-password":
					Swal.fire("Erro", "Usário ou senha icorreto!", "error");
					break;
				case "auth/user-not-found":
					Swal.fire("Erro", "Usário ou senha icorreto!", "error");
					break;
				case "auth/invalid-email":
					Swal.fire("Erro", "Você digitou um endereço de e-mail inválido!", "error");
					break;
				case "auth/too-many-requests":
					Swal.fire("Erro", "O acesso a esta conta foi temporariamente desativado devido a muitas tentativas de login malsucedidas. Você pode restaurá-lo imediatamente redefinindo sua senha ou pode tentar novamente mais tarde.", "error");
					break;
				default:
					Swal.fire("Erro", "Ocorreu um erro ao tentar fazer login, tente mais tarde ou entre em contato com administrador do software.", "error");
			}
		}
	};

	const fazerLogOff = async () => {
		try {
			const { isConfirmed } = await Swal.fire({
				title: "Atenção",
				text: "Tem certeza que deseja sair do sistema?",
				showConfirmButton: true,
				confirmButtonText: "Sim",
				confirmButtonColor: "#26A95E",
				showCancelButton: true,
				cancelButtonText: "Não",
				cancelButtonColor: "#f00",
			});

			if (isConfirmed) {
				await auth.signOut();
				Swal.fire("Sucesso!", "Você será redirecionado para a pagina de login!", "success");
			}
		} catch (error) {
			console.log(error);
		}
	};

	/**Cria novos itens */
	const createItem = async ({ item }: { item: TodoItemProps }) => {
		try {
			if (!empresa) {
				Swal.fire("Erro", "Nenhum empresa selecionada!", "error");
				return;
			}

			const ref = collection(db, "items");
			await addDoc(ref, item);
			Swal.fire("Sucesso", "Item adicionado com sucesso!", "success");
		} catch (error) {
			console.log(error);
			Swal.fire("Erro", "Houver um erro ao tentar realizar esta ação", "error");
		}
	};

	/**Cria novos itens */
	const editItem = async ({ itemId, item }: { itemId: string, item: TodoItemProps }) => {
		try {
			const ref = doc(db, `items/${itemId}`);
			await updateDoc(ref, item as any);
			Swal.fire("Sucesso", "Item atualizado com sucesso!", "success");
		} catch (error) {
			console.log(error);
			Swal.fire("Erro", "Houver um erro ao tentar realizar esta ação", "error");
		}
	};

	/**Otem uma lista de items */
	const getItems = useCallback(async ({ inicio: inicioRef, fim: fimRef }: { inicio: Date; fim: Date }) => {
		try {
			const ref = collection(db, "items");
			const inicio = Timestamp.fromDate(new Date(`${inicioRef.toISOString().split("T")[0]}T00:00`));
			const fim = Timestamp.fromDate(new Date(`${fimRef.toISOString().split("T")[0]}T20:59:59`));

			const queryRef = query(ref,
				where("vencimento", ">=", inicio),
				where("vencimento", "<=", fim),
				where("owner", "==", user?.uid),
			);

			const snapshot = await getDocs(queryRef);
			const items = snapshot.docs.map(item => ({ ...item.data(), id: item.id } as TodoItemProps));
			return items;
		}
		catch (error) {
			Swal.fire("Erro", "Houve um erro ao obter os items", "error");
			console.log(error);
		}
	}, [user?.uid]);

	/**Deleta um item pelo id */
	const deleteItem = async ({ itemId }: { itemId: string }) => {
		try {
			const ref = doc(db, `items/${itemId}`);
			await deleteDoc(ref);
			Swal.fire("Sucesso!", "Item deletado com sucesso!", "success");
		} catch (error) {
			Swal.fire("Erro", "Houve um erro ao tentar realizar esta ação", "error");
			console.log(error);
		}
	};

	/**funcionalidade para buscar empresas */
	const getCompany = useCallback(async ({ userId }: { userId: string }) => {
		try {
			const referencia = collection(db, "empresas");
			const queryRef = query(
				referencia,
				where("owner", "==", userId),
				limit(1)
			);
			const snapshot = await getDocs(queryRef);
			const empresas = snapshot.docs.map(item => ({ ...item.data(), id: item.id } as CompanyProps));
			return empresas[0];
		} catch (error) {
			console.log(error);
		}
	}, []);

	/**Funcionalidade para adicionar empresas */
	const createCompany = async ({ company }: { company: CompanyProps }) => {

		try {
			if (user) {
				const result = await getCompany({ userId: user?.uid });

				if (result) {
					Swal.fire("Erro", "Já existe uma empresa cadastrada para este usuário!", "error");
					return;
				}

				const referencia = collection(db, "empresas");
				const snapshot = await addDoc(referencia, company);
				if (snapshot.id) {
					Swal.fire("Sucesso", "Empresa adicionada com sucesso!", "success");
				}
			}

		} catch (error) {
			console.log(error);
			Swal.fire("Erro", "Houve um erro ao tentar adicionar esta empresa!", "error");
		}
	};

	/**Funcionalidade para adicionar empresas */
	const editCompany = async ({ companyId, company }: { companyId: string; company: CompanyProps }) => {
		try {
			const referencia = doc(db, `empresas/${companyId}`);
			await updateDoc(referencia, company as any);
			Swal.fire("Sucesso", "Empresa atualizada com sucesso!", "success");
		} catch (error) {
			console.log(error);
			Swal.fire("Erro", "Houve um erro ao tentar atualizar esta empresa!", "error");
		}
	};

	const deleteCompany = async ({ empresaId }: { empresaId: string }) => {
		try {
			const result = await confirmMiddleware();
			if (!result) {
				return;
			}

			const referencia = doc(db, `empresas/${empresaId}`);
			await deleteDoc(referencia);
			Swal.fire("Sucesso!", "Empresa deletada com sucesso!", "success");
			return "DELETED";
		}
		catch (error) {
			console.log(error);
			Swal.fire("Erro", "Houve um erro ao realizar esta ação!", "error");
			return "ERROR";
		}
	};
	return {
		fazerLogin,
		fazerLogOff,
		createItem,
		getItems,
		deleteItem,
		editItem,
		createCompany,
		editCompany,
		getCompany,
		deleteCompany
	};
}