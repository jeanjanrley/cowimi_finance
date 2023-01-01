import { TodoItemProps } from "../../types";
import { BiEdit } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import { useQueries } from "../../hooks/useQueries";
import { MainContext } from "../../contexts";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { confirmMiddleware } from "../../utils/middlewares";
import { TodoItemStyles } from "./styles";
import { parserLocale } from "../../utils/parses";

interface TodoItemComponentProps {
	item: TodoItemProps;
}

export function TodoItem({ item }: TodoItemComponentProps) {
	const { deleteItem } = useQueries();
	const { setItems } = useContext(MainContext);
	const navigate = useNavigate();

	const handleEditItem = async () => {
		try {
			const result = await confirmMiddleware();
			if (!result) {
				return;
			}

			navigate("/addItem", { state: { item: item } });
		} catch (error) {
			console.log(error);
		}
	};

	const handleDeleteItem = async () => {
		try {
			const result = await confirmMiddleware();
			if (!result) {
				return;
			}

			item.id && await deleteItem({ itemId: item.id });
			setItems(prev => prev && prev.filter(i => i.id !== item.id));
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<TodoItemStyles status={item.status}>
			<div className="todo-header-area">
				<div className="title-area">
					<h2>{`${item.title} - ${parserLocale(item.value)}`}</h2>
					<div className="icons-area">
						<BiEdit color="#fff" size={24} cursor="pointer" onClick={handleEditItem} />
						<AiOutlineDelete color="#fff" size={24} cursor="pointer" onClick={handleDeleteItem} />
					</div>
				</div>
				<p>{item.description}</p>
			</div>
		</TodoItemStyles>
	);
}