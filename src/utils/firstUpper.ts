export function fisrtUpper(text: string) {
	try {
		const lowerText = text.toLowerCase();
		const newText = lowerText[0].toUpperCase() + lowerText.slice(1, lowerText.length);
		return newText;
	}
	catch (error) {
		console.log(error);
		return text;
	}
}