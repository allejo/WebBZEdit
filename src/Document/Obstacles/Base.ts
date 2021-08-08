import { INameable } from '../Attributes/INameable';
import { IPositionable } from '../Attributes/IPositionable';
import { ISizeable } from '../Attributes/ISizeable';
import { bzwFloat, bzwInt, bzwString, bzwVector3F } from '../attributeParsers';
import { IBaseObject, newIBaseObject } from './BaseObject';

export const BaseProperties = {
  position: bzwVector3F,
  size: bzwVector3F,
  rotation: bzwFloat,
  color: bzwInt,
  oncap: bzwString,
};

export interface IBase
  extends IBaseObject,
    INameable,
    IPositionable,
    ISizeable {
  color: 1 | 2 | 3 | 4;
  oncap?: string;
}

export function newIBase(): IBase {
  return {
    ...newIBaseObject('base'),
    position: [0, 0, 0],
    size: [16, 16, 4],
    rotation: 0,
    color: 1,
  };
}
