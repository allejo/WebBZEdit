import { Vector4F } from '../../Utilities/types';
import { INameable } from '../Attributes/INameable';
import {
  bzwFloat,
  bzwFloatVector,
  bzwString,
  bzwVector4F,
} from '../attributeParsers';
import { IBaseObject, newIBaseObject } from './BaseObject';

export const TextureMatrixProperties = {
  name: bzwString,
  scale: bzwVector4F,
  spin: bzwFloat,
  shift: bzwFloatVector,
  center: bzwFloatVector,
  fixedscale: bzwFloatVector,
  fixedspin: bzwFloat,
  fixedshift: bzwFloatVector,
};

export interface ITextureMatrix extends IBaseObject, INameable {
  scale?: Vector4F;
  spin?: number;
  shift?: number[];
  center?: number[];
  fixedscale?: number[];
  fixedspin?: number;
  fixedshift?: number[];
}

export function newITextureMatrix(): ITextureMatrix {
  return {
    ...newIBaseObject('texturematrix'),
    name: 'textureMatrix',
  };
}
