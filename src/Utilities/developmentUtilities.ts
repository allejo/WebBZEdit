export function assertEveryIsNotNull(values: any[], message: string) {
	if (values.every((v) => v != null)) {
		throw new Error(message);
	}
}

export function assertNotNull<T>(
	value: T | null,
	message: string,
): asserts value is NonNullable<T> {
	if (value == null) {
		throw new Error(message);
	}
}

export function isDevEnv() {
	return import.meta.env.DEV;
}
