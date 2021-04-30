import { BaseObject } from './BaseObject';
import { bzwFloat, bzwInt, bzwString, bzwVector3F } from '../attributeParsers';
import { Vector3F } from '../../Utilities/types';
import { INameable, IPositionable } from './partials';

export const BaseProperties = {
  position: bzwVector3F,
  size: bzwVector3F,
  rotation: bzwFloat,
  color: bzwInt,
  oncap: bzwString,
};

export interface IBase extends INameable, IPositionable {
  color: 1 | 2 | 3 | 4;
  oncap?: string;
}

export class Base extends BaseObject implements IBase {
  objectType = 'base';
  definitions = BaseProperties;

  name?: string;
  position: Vector3F = [0, 0, 0];
  size: Vector3F = [16, 16, 4];
  rotation: number = 0;
  color: 1 | 2 | 3 | 4 = 1;
  oncap?: string;
}
