export interface IPassableObject {
	drivethrough: boolean;
	shootthrough: boolean;
	passable: boolean;
}

export function implementsIPassableObject(
	value: object,
): value is IPassableObject {
	return (
		'drivethrough' in value &&
		'shootthrough' in value &&
		'passable' in value &&
		true
	);
}

export function newIPassableObject(): IPassableObject {
	return {
		drivethrough: false,
		shootthrough: false,
		get passable(): boolean {
			return this.drivethrough && this.shootthrough;
		},
		set passable(value: boolean) {
			this.drivethrough = value;
			this.shootthrough = value;
		},
	};
}
