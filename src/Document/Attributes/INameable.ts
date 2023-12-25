export interface INameable {
	name?: string;
}

export function implementsINameable(value: object): value is INameable {
	return 'name' in value;
}
