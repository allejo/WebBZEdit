import { Vector3F } from '../../Utilities/types';
import { bzwFloat, bzwVector3F } from '../attributeParsers';

export interface IPositionable {
  position: Vector3F;
  pos?: Vector3F;
  rotation?: number;
  rot?: number;
}

export const PositionableProperties = {
  position: bzwVector3F,
  pos: bzwVector3F,
  rotation: bzwFloat,
  rot: bzwFloat,
};

export function implementsIPositionable(value: any): value is IPositionable {
  return value.hasOwnProperty('position') && value.hasOwnProperty('rotation');
}
