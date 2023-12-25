export interface IMaterialFriendly {
	matref?: string;
}

export function implementsIMaterialFriendly(
	value: object,
): value is IMaterialFriendly {
	return 'matref' in value;
}
