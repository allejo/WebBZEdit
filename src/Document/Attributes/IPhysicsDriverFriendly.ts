export interface IPhysicsDriverFriendly {
	phydrv?: string;
}

export function implementsIPhysicsDriverFriendly(
	value: object,
): value is IPhysicsDriverFriendly {
	return 'phydrv' in value;
}
