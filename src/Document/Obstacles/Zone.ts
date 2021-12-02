import { INameable } from '../Attributes/INameable';
import { IPositionable } from '../Attributes/IPositionable';
import {
  bzwFloat,
  bzwIntVector,
  bzwRepeatable,
  bzwString,
  bzwVector3F,
} from '../attributeParsers';
import { IBaseObject, newIBaseObject } from './BaseObject';

export const ZoneProperties = {
  name: bzwString,
  position: bzwVector3F,
  size: bzwVector3F,
  rotation: bzwFloat,
  zoneflag: bzwRepeatable(bzwString),
  flag: bzwRepeatable(bzwString),
  team: bzwIntVector,
  safety: bzwIntVector,
};

export interface IZone extends IBaseObject, INameable, IPositionable {
  zoneflag: string[];
  flag: string[];
  team?: (0 | 1 | 2 | 3 | 4 | 5 | 6)[];
  safety?: (1 | 2 | 3 | 4)[];
}

export function newIZone(): IZone {
  return {
    ...newIBaseObject('zone'),
    position: [0, 0, 0],
    size: [10, 10, 4],
    rotation: 0,
    zoneflag: [],
    flag: [],
  };
}
