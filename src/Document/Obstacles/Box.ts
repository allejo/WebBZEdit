import { bzwBool, bzwFloat, bzwString, bzwVector3F } from '../attributeParsers';
import { IBaseObject, newIBaseObject, newIPassableObject } from './BaseObject';
import { IPositionable } from '../Attributes/IPositionable';
import { IPassableObject } from '../Attributes/IPassableObject';
import { IPhysicsDriverFriendly } from '../Attributes/IPhysicsDriverFriendly';
import { INameable } from '../Attributes/INameable';
import { IMaterialFriendly } from '../Attributes/IMaterialFriendly';

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

export interface IBox
  extends IBaseObject,
    IMaterialFriendly,
    INameable,
    IPassableObject,
    IPositionable,
    IPhysicsDriverFriendly {}

export function newIBox(): IBox {
  return {
    ...newIBaseObject('box'),
    ...newIPassableObject(),
    position: [0, 0, 0],
    size: [5, 5, 5],
    rotation: 0,
  };
}
