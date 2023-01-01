import Swal from "sweetalert2";

export const confirmMiddleware = async () => {
	const { isConfirmed } = await Swal.fire({
		title: "Atenção!",
		text: "Tem certeza que deseja realizar esta ação?",
		showConfirmButton: true,
		showCancelButton: true,
		confirmButtonText: "Sim",
		cancelButtonText: "Não",
		cancelButtonColor: "#f00"
	});

	return isConfirmed;
};
