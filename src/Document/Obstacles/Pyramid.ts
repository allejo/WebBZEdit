import { BaseObject } from './BaseObject';
import { bzwBool, bzwString, bzwVector3F } from '../attributeParsers';
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
  rotate: bzwVector3F,
  matref: bzwString,
  phydrv: bzwString,
  drivethrough: bzwBool,
  shootthrough: bzwBool,
  zflip: bzwBool,
};

export interface IPyramid
  extends IMaterialFriendly,
    INameable,
    IPhysicsDriverFriendly,
    IPassableObject,
    IPositionable {
  zflip: boolean;
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
  zflip: boolean = false;

  get passable(): boolean {
    return this.driveThrough && this.shootThrough;
  }

  set passable(value: boolean) {
    this.drivethrough = value;
    this.shootthrough = value;
  }
}
