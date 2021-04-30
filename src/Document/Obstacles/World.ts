import { BaseObject } from './BaseObject';
import { bzwBool, bzwFloat, bzwString } from '../attributeParsers';
import { INameable } from './partials';

export const WorldProperties = {
  name: bzwString,
  size: bzwFloat,
  flagheight: bzwFloat,
  nowalls: bzwBool,
  freectfspawns: bzwBool,
};

export interface IWorld extends INameable {
  size: number;
  flagheight?: number;
  nowalls: boolean;
  freectfspawns: boolean;
}

export class World extends BaseObject implements IWorld {
  objectType = 'world';
  definitions = WorldProperties;

  size: number = 800;
  flagheight?: number;
  nowalls: boolean = false;
  freectfspawns: boolean = false;
}
