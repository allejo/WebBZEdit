import { Vector3F } from '../../Utilities/types';

export interface IMaterialFriendly {
  matref?: string;
}

export interface INameable {
  name?: string;
}

export interface IPhysicsDriverFriendly {
  phydrv?: string;
}

export interface IPassableObject {
  drivethrough: boolean;
  shootthrough: boolean;
  passable: boolean;
}

export interface IPositionable {
  position: Vector3F;
  size: Vector3F;
  rotation?: number;
}
