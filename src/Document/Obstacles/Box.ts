import { BaseObject } from './BaseObject';
import { bzwBool, bzwFloat, bzwString, bzwVector3F } from '../attributeParsers';

export class Box extends BaseObject {
  objectType = 'box';
  definitions = {
    name: bzwString,
    position: bzwVector3F,
    size: bzwVector3F,
    rotation: bzwFloat,
    matref: bzwString,
    phydrv: bzwString,
    drivethrough: bzwBool,
    shootthrough: bzwBool,
  };
}
