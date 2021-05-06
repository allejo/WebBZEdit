import { bzwBool, bzwFloat, bzwString, bzwVector3F } from '../attributeParsers';
import {
  IMaterialFriendly,
  INameable,
  IPassableObject,
  IPhysicsDriverFriendly,
  IPositionable,
} from '../attributePartials';
import { IBaseObject, newIBaseObject, newIPassableObject } from './BaseObject';

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
  extends IBaseObject,
    IMaterialFriendly,
    INameable,
    IPhysicsDriverFriendly,
    IPassableObject,
    IPositionable {
  flipz: boolean;
}

export function newIPyramid(): IPyramid {
  return {
    ...newIBaseObject('pyramid'),
    ...newIPassableObject(),
    position: [0, 0, 0],
    size: [7, 7, 12],
    rotation: 0,
    flipz: false,
  };
}
