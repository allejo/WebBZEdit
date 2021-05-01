import { BaseObject } from './BaseObject';
import { bzwBool, bzwFloat, bzwString, bzwVector3F } from '../attributeParsers';
import {
  IMaterialFriendly,
  INameable,
  IPassableObject,
  IPhysicsDriverFriendly,
  IPositionable,
} from '../attributePartials';
import { Vector3F } from '../../Utilities/types';

export const PyramidProperties = {
  name: bzwString,
  position: bzwVector3F,
  size: bzwVector3F,
  rotation: bzwFloat,
  matref: bzwString,
  phydrv: bzwString,
  drivethrough: bzwBool,
  shootthrough: bzwBool,
  flipz: bzwBool,
};

export interface IPyramid
  extends IMaterialFriendly,
    INameable,
    IPhysicsDriverFriendly,
    IPassableObject,
    IPositionable {
  flipz: boolean;
}

export class Pyramid extends BaseObject implements IPyramid {
  objectType = 'pyramid';
  definitions = PyramidProperties;

  name?: string;
  position: Vector3F = [0, 0, 0];
  size: Vector3F = [7, 7, 12];
  rotation: number = 0;
  matref?: string;
  phydrv?: string;
  drivethrough: boolean = false;
  shootthrough: boolean = false;
  flipz: boolean = false;

  get passable(): boolean {
    return this.driveThrough && this.shootThrough;
  }

  set passable(value: boolean) {
    this.drivethrough = value;
    this.shootthrough = value;
  }
}
