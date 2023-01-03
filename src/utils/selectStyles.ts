import { StylesConfig, GroupBase } from "react-select";
import { ValueTypes } from "../types";

export const selectStyles: StylesConfig<ValueTypes<any>, false, GroupBase<ValueTypes<any>>> | undefined = {
	container: (base, props) => ({
		...base,
		height: 35,
		maxHeight: 35,
		flexGrow: 1
	})
};