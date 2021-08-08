import { Vector3F } from '../../Utilities/types';

export interface ISizeable {
  size: Vector3F;
}

export function implementsISizeable(value: any): value is ISizeable {
  return value.hasOwnProperty('size');
}
