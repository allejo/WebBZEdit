import { BaseObject } from './BaseObject';
import { parseBool, parseString, parseVector3F } from '../attributeParsers';

export class Pyramid extends BaseObject {
  objectType = 'pyramid';
  definitions = {
    name: parseString,
    position: parseVector3F,
    size: parseVector3F,
    rotate: parseVector3F,
    matref: parseString,
    phydrv: parseString,
    drivethrough: parseBool,
    shootthrough: parseBool,
    zflip: parseBool,
  };
}
