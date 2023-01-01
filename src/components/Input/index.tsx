import { useEffect, useRef } from "react";
import { useField } from "@unform/core";
import styled, { css } from "styled-components";

interface Props {
	name: string
	label?: string
	width?: string;
}

type InputProps = JSX.IntrinsicElements["input"] & Props;

export function Input({ name, label, ...rest }: InputProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const { fieldName, defaultValue, registerField, error } = useField(name);

	// Registra o input no formulario
	useEffect(() => {
		registerField({
			name: fieldName,
			ref: inputRef,
			getValue: ref => {
				return ref.current.value;
			},
			setValue: (ref, value) => {
				ref.current.value = value ?? "";
			},
			clearValue: ref => {
				ref.current.value = "";
			},
		});
	}, [fieldName, registerField]);

	return (
		<Container width={rest.width}>
			<label>{label}</label>
			<input
				{...rest}
				ref={inputRef}
				defaultValue={defaultValue}
			/>
			{error && <span className="error-input">{error}</span>}
		</Container>
	);
}

interface ContainerProps {
	width?: string;
}

const Container = styled.div<ContainerProps>`
	display: flex;
	flex-direction: column;
	width: 100%;
	align-items: flex-start;
	gap: 4px;

	> input{
		width: 100%;
		display: flex;
		border: 1px solid #ccc;
		border-radius: 5px;
		padding: 5px;
		height: 40px;
	}

	.error-input{
		color: #f00;
		font-size: 10pt;
		font-weight: 500;
	}
`;