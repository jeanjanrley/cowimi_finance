import styled from "styled-components";
import { TodoStatusTypes } from "../../types";

export const TodoItemStyles = styled.div<{ status: TodoStatusTypes }>`
	display: flex;
	background: #474747;
	border-radius: 4px;
	padding: 8px;
	width: 100%;
	border-left: ${({ status }) => status === "PAGO" || status === "RECEBIDO" ? "5px solid #31AA63" : "5px solid #F59A2F"};
	min-height: max-content;
	align-items: center;

	.todo-header-area {
		display: flex;
		flex-direction: column;
		width: 100%;


		h2,
		p {
			line-height: 1.2;
		}


		h2 {
			font-size: 16px;
		}

		p {
			font-size: 14px;
			color: #ccc;
		}

		.title-area {
			display: flex;
			justify-content: space-between;
			width: 100%;
			gap: 12px;

			.icons-area {
				display: flex;
				gap: 12px;
			}
		}
	}
`;