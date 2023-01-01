export const parserLocale = (value: number) => {
	return value.toLocaleString("pt-BR", {
		currency: "BRL",
		style: "currency",
		maximumFractionDigits: 2,
		minimumIntegerDigits: 2
	});
};