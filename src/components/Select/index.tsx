import React from "react";
import { useField } from "@unform/core";
import styled, { css } from "styled-components";
import SelectDefault, { GroupBase, Props as SelectProps, SelectInstance } from "react-select";
import { ValueTypes } from "../../types";


interface Props extends SelectProps<ValueTypes, false, GroupBase<ValueTypes>> {
	name: string
	label?: string
	noStyle?: boolean;
	selectRef: React.MutableRefObject<SelectInstance<ValueTypes, false, GroupBase<ValueTypes>> | null>
}

export function Select({ name, label, noStyle, id, selectRef, ...rest }: Props) {
	const { fieldName, defaultValue, registerField, error } = useField(name);

	React.useEffect(() => {
		try {
			registerField({
				name: fieldName,
				ref: selectRef,
				getValue: () => selectRef.current?.getValue()[0]?.value ? selectRef.current?.getValue()[0].value : undefined,
				setValue: (reference, value) => reference.current?.selectOption({ label: value, value }),
				clearValue: () => selectRef.current?.clearValue()
			});
		} catch (error) {
			console.log(error);
		}
	}, [fieldName, registerField, selectRef]);

	return (
		<Container noStyle={noStyle}>
			<label onClick={() => {
				selectRef.current?.focus();
			}}>{label}</label>
			<SelectDefault
				{...rest}
				id={id}
				className={error ? "has-error" : ""}
				ref={selectRef}
				defaultValue={defaultValue}
			/>
			{error && <span className="error-input">{error}</span>}
		</Container>
	);
}

interface ContainerProps {
	noStyle?: boolean;
}

const Container = styled.div<ContainerProps>`
	${props => {
		return !props.noStyle ? css`
				display: flex;
				flex-direction: column;
				gap: 5px;
				width: 100%;

				>label {
					color: #777;
					font-size: 1rem;
					cursor: pointer;
				}

				.error-input{
					line-height: 1;
					color: #f00;
					font-size: 0.8rem;
				}
		` : null;
	}}
`;