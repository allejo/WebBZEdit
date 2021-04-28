import { BaseObject } from './BaseObject';
import { bzwBool, bzwString, bzwVector3F } from '../attributeParsers';

export class Pyramid extends BaseObject {
  objectType = 'pyramid';
  definitions = {
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
}
