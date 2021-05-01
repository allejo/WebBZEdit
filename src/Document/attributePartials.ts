import { Vector3F } from '../Utilities/types';

export interface IMaterialFriendly {
  matref?: string;
}

export function implementsIMaterialFriendly(
  value: any,
): value is IMaterialFriendly {
  return value.hasOwnProperty('matref');
}

export interface INameable {
  name?: string;
}

export function implementsINameable(value: any): value is INameable {
  return value.hasOwnProperty('name');
}

export interface IPhysicsDriverFriendly {
  phydrv?: string;
}

export function implementsIPhysicsDriverFriendly(
  value: any,
): value is IPhysicsDriverFriendly {
  return value.hasOwnProperty('phydrv');
}

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

export interface IPositionable {
  position: Vector3F;
  size: Vector3F;
  rotation?: number;
}

export function implementsIPositionable(value: any): value is IPositionable {
  return (
    value.hasOwnProperty('position') &&
    value.hasOwnProperty('size') &&
    value.hasOwnProperty('rotation') &&
    true
  );
}
