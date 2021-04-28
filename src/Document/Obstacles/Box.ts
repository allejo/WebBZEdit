import { BaseObject } from './BaseObject';
import { parseBool, parseFloat, parseString, parseVector3F } from '../attributeParsers';

export class Box extends BaseObject {
  objectType = 'box';
  definitions = {
    name: parseString,
    position: parseVector3F,
    size: parseVector3F,
    rotation: parseFloat,
    matref: parseString,
    phydrv: parseString,
    drivethrough: parseBool,
    shootthrough: parseBool,
  };
}
