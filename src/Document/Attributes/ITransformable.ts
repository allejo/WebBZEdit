import { Vector3F, Vector4F } from '../../Utilities/types';
import {
  bzwRepeatable,
  bzwString,
  bzwVector3F,
  bzwVector4F,
} from '../attributeParsers';

export const TransformableProperties = {
  shift: bzwRepeatable(bzwVector3F),
  scale: bzwRepeatable(bzwVector3F),
  shear: bzwRepeatable(bzwVector3F),
  spin: bzwRepeatable(bzwVector4F),
  xform: bzwRepeatable(bzwString),
};

export interface ITransformable {
  shift?: Vector3F[];
  scale?: Vector3F[];
  shear?: Vector3F[];
  spin?: Vector4F[];

  // @TODO Transforms can be referenced as names, I guess?
  xform?: string[];
}

export function implementsITransformable(value: any): value is ITransformable {
  return (
    value.hasOwnProperty('shift') ||
    value.hasOwnProperty('scale') ||
    value.hasOwnProperty('shear') ||
    value.hasOwnProperty('spin') ||
    value.hasOwnProperty('xform')
  );
}
