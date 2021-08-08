import { Vector3F } from '../../Utilities/types';

export interface IPositionable {
  position: Vector3F;
  rotation?: number;
}

export function implementsIPositionable(value: any): value is IPositionable {
  return value.hasOwnProperty('position') && value.hasOwnProperty('rotation');
}
