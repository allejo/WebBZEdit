export interface IPhysicsDriverFriendly {
  phydrv?: string;
}

export function implementsIPhysicsDriverFriendly(
  value: any,
): value is IPhysicsDriverFriendly {
  return value.hasOwnProperty('phydrv');
}
