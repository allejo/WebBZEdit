import { BaseObject } from './BaseObject';
import { bzwFloat, bzwIntVector, bzwRepeatable, bzwString, bzwVector3F } from '../attributeParsers';
import { INameable, IPositionable } from '../attributePartials';
import { Vector3F } from '../../Utilities/types';

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

export interface IZone extends INameable, IPositionable {
  zoneflag: string[];
  flag: string[];
  team?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  safety?: 1 | 2 | 3 | 4;
}

export class Zone extends BaseObject implements IZone {
  objectType = 'zone';
  definitions = ZoneProperties;

  name?: string;
  position: Vector3F = [0, 0, 0];
  size: Vector3F = [10, 10, 4];
  rotation: number = 0;
  zoneflag: string[] = [];
  flag: string[] = [];
  team?: IZone['team'];
  safety?: IZone['safety']
}
