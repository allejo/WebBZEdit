import { bzwBool, bzwFloat, bzwString } from '../attributeParsers';
import { IBaseObject, newIBaseObject } from './BaseObject';
import { INameable } from '../Attributes/INameable';

export const WorldProperties = {
  name: bzwString,
  size: bzwFloat,
  flagheight: bzwFloat,
  nowalls: bzwBool,
  freectfspawns: bzwBool,
};

export interface IWorld extends IBaseObject, INameable {
  size: number;
  flagheight?: number;
  nowalls: boolean;
  freectfspawns: boolean;
}

export function newIWorld(): IWorld {
  return {
    ...newIBaseObject('world'),
    size: 800,
    nowalls: false,
    freectfspawns: false,
  };
}
