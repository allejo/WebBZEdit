import { BaseObject } from './BaseObject';
import { bzwBool, bzwFloat, bzwString } from '../attributeParsers';

export class World extends BaseObject {
  objectType = 'world';
  definitions = {
    name: bzwString,
    size: bzwFloat,
    flagheight: bzwFloat,
    nowalls: bzwBool,
    freectfspawns: bzwBool,
  };
}
