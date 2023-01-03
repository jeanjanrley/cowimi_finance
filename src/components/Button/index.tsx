import { ReactNode } from "react";

interface Props {
	children: ReactNode;
}

type ButtomComponentProps = JSX.IntrinsicElements["button"] & Props;

export function Button({ children, ...rest }: ButtomComponentProps) {

	return (
		<button {...rest} style={{ height: "40px" }}>
			{children}
		</button>
	);
}