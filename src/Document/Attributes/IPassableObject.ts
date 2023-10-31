export interface IPassableObject {
	drivethrough: boolean;
	shootthrough: boolean;
	passable: boolean;
}

export function implementsIPassableObject(
	value: any,
): value is IPassableObject {
	return (
		value.hasOwnProperty('drivethrough') &&
		value.hasOwnProperty('shootthrough') &&
		value.hasOwnProperty('passable') &&
		true
	);
}
