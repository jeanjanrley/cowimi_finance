import { useRef } from "react";
import { Input } from "../../components/Input";
import { useQueries } from "../../hooks/useQueries";
import "./styles.scss";
import * as Yup from "yup";
import { FormHandles, SubmitHandler } from "@unform/core";
import { Form } from "@unform/web";
import { confirmMiddleware } from "../../utils/middlewares";
import { validate } from "email-validator";
import Swal from "sweetalert2";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
import { Button } from "../../components/Button";

export function LoginPage() {
	const { fazerLogin } = useQueries();
	const formRef = useRef<FormHandles>(null);


	// trata o evento de submit do formulario
	const handleSubmit: SubmitHandler<any> = async data => {
		try {
			// Remove all previous errors
			formRef.current?.setErrors({});
			const schema = Yup.object().shape({
				email: Yup.string()
					.required("O e-mail é obrigatório")
					.email(),
				password: Yup.string()
					.required("Sua senha é obrigatória")
					.min(6, "Minimo 6 digitos")
					.max(24, "Máximo 24 digitos")
			});

			await schema.validate(data, {
				abortEarly: false,
			});

			// Validation passed
			const { email, password } = data;
			await fazerLogin({ email, password });
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

	const handleForgot = async () => {
		try {
			const email = formRef.current?.getFieldValue("email");

			if (!validate(email)) {
				Swal.fire("Erro", "Digite um e-mail válido", "error");
				return;
			}

			const result = await confirmMiddleware();
			if (!result) {
				return;
			}

			formRef.current?.clearField("password");
			formRef.current?.setErrors({ password: "" });

			email && await sendPasswordResetEmail(auth, email);
			Swal.fire(
				"Sucesso!",
				"Se este endereço de e-mail estava cadastrado em nosso banco de dados, enviamos um link para que você possa recuperar sua senha!",
				"success"
			);
		} catch (error) {
			Swal.fire("Erro", "Houve um erro ao tentar realizar esta ação", "error");
		}
	};

	return (
		<div className="page login-age">
			<div className="container">
				<div className="container-form">
					<div className="header-area">
						<h2>Fazer Login</h2>
						<p>Cowimi Finance</p>
					</div>
					<Form
						ref={formRef}
						onSubmit={handleSubmit}
						className="login-form">
						<Input
							label="E-mail"
							name="email"
							type="email"
							placeholder="Digite o seu e-mail"
						/>
						<Input
							label="Senha"
							name="password"
							type="password"
							placeholder="Digite sua senha"
						/>
						<label
							className="forgot-password"
							onClick={handleForgot}>
							Esqueci minha senha
						</label>
						<Button>Fazer login</Button>
					</Form>
				</div>
			</div>
		</div >
	);
}