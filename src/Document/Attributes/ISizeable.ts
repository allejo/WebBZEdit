import { Vector3F } from '../../Utilities/types';
import { bzwVector3F } from '../attributeParsers';

export const SizeableProperties = {
  size: bzwVector3F,
};

export interface ISizeable {
  size: Vector3F;
}

export function implementsISizeable(value: any): value is ISizeable {
  return value.hasOwnProperty('size');
}
