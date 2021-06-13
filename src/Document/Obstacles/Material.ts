import { Vector4F } from '../../Utilities/types';
import { INameable } from '../Attributes/INameable';
import { bzwBool, bzwFloat, bzwString, bzwVector4F } from '../attributeParsers';
import { IBaseObject, newIBaseObject } from './BaseObject';

export const MaterialProperties = {
  name: bzwString,
  texture: bzwString,
  addtexture: bzwString,
  notextures: bzwBool,
  notexcolor: bzwBool,
  notexalpha: bzwBool,
  texmat: bzwString,
  dyncol: bzwString,
  ambient: bzwVector4F,
  diffuse: bzwVector4F,
  color: bzwVector4F,
  specular: bzwVector4F,
  emission: bzwVector4F,
  shininess: bzwFloat,
  resetmat: bzwBool,
  spheremap: bzwBool,
  noradar: bzwBool,
  noshadow: bzwBool,
  noculling: bzwBool,
  nosorting: bzwBool,
  nolighting: bzwBool,
  alphathresh: bzwFloat,
  groupalpha: bzwBool,
  occluder: bzwBool,
};

export interface IMaterial extends IBaseObject, INameable {
  texture?: string;
  addtexture?: string;
  notextures?: boolean;
  notexcolor?: boolean;
  notexalpha?: boolean;
  texmat: string;
  dyncol: string;
  ambient?: Vector4F;
  diffuse?: Vector4F;
  color?: Vector4F;
  specular?: Vector4F;
  emission?: Vector4F;
  shininess?: number;
  resetmat?: boolean;
  spheremap?: boolean;
  noradar?: boolean;
  noshadow?: boolean;
  noculling?: boolean;
  nosorting?: boolean;
  nolighting?: boolean;
  alphathresh?: number;
  groupalpha?: boolean;
  occluder?: boolean;
}

export function newIMaterial(): IMaterial {
  return {
    ...newIBaseObject('material'),
    texmat: '-1',
    dyncol: '-1',
  };
}
