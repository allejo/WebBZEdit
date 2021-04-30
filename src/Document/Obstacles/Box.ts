import { BaseObject } from './BaseObject';
import { bzwBool, bzwFloat, bzwString, bzwVector3F } from '../attributeParsers';
import { Vector3F } from '../../Utilities/types';
import { IMaterialFriendly, INameable, IPassableObject, IPhysicsDriverFriendly, IPositionable } from './partials';

export const BoxProperties = {
  name: bzwString,
  position: bzwVector3F,
  size: bzwVector3F,
  rotation: bzwFloat,
  matref: bzwString,
  phydrv: bzwString,
  drivethrough: bzwBool,
  shootthrough: bzwBool,
};

export interface IBox extends
  IMaterialFriendly,
  INameable,
  IPassableObject,
  IPositionable,
  IPhysicsDriverFriendly {
}

export class Box extends BaseObject implements IBox {
  objectType = 'box';
  definitions = BoxProperties;

  name?: string;
  position: Vector3F = [0, 0, 0];
  size: Vector3F = [5, 5, 5];
  rotation: number = 0;
  matref?: string;
  phydrv?: string;
  drivethrough: boolean = false;
  shootthrough: boolean = false;

  get passable(): boolean {
    return this.drivethrough && this.shootthrough;
  }

  set passable(value: boolean) {
    this.drivethrough = value;
    this.shootthrough = value;
  }
}
