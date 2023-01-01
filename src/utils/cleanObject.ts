export function cleanObject<T>(object: any): T {
	const result = Object.fromEntries(Object.entries(object).filter(item => item[1]));
	return result as T;
}
