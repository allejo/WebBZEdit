import { BaseObject } from './BaseObject';
import { bzwFloat, bzwIntVector, bzwRepeatable, bzwString, bzwVector3F } from '../attributeParsers';

export class Zone extends BaseObject {
  objectType = 'zone';
  definitions = {
    name: bzwString,
    position: bzwVector3F,
    size: bzwVector3F,
    rotation: bzwFloat,
    zoneflag: bzwRepeatable(bzwString),
    flag: bzwRepeatable(bzwString),
    team: bzwIntVector,
    safety: bzwIntVector,
  };
}
