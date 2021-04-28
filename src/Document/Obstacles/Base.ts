import { BaseObject } from './BaseObject';
import { bzwFloat, bzwInt, bzwString, bzwVector3F } from '../attributeParsers';

export class Base extends BaseObject {
  objectType = 'base';
  definitions = {
    position: bzwVector3F,
    size: bzwVector3F,
    rotation: bzwFloat,
    color: bzwInt,
    oncap: bzwString,
  };
}
