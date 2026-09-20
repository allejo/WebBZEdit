import { bzwString } from '../attributeParsers';

export const PhysicsDriverFriendlyProperties = {
  phydrv: bzwString,
};

export interface IPhysicsDriverFriendly {
  phydrv?: string;
}

export function implementsIPhysicsDriverFriendly(
  value: any,
): value is IPhysicsDriverFriendly {
  return value.hasOwnProperty('phydrv');
}
