import { IMaterialFriendly } from '../Attributes/IMaterialFriendly';
import { IPassableObject } from '../Attributes/IPassableObject';
import { bzwBool, bzwIntVector, bzwString } from '../attributeParsers';
import { IBaseObject, newIBaseObject, newIPassableObject } from './BaseObject';

export const MeshFaceProperties = {
  vertices: bzwIntVector,
  normals: bzwIntVector,
  texcoords: bzwIntVector,
  phydrv: bzwString,
  smoothbounce: bzwBool,
  noclusters: bzwBool,
  drivethrough: bzwBool,
  shootthrough: bzwBool,
  passable: bzwBool,
  matref: bzwString,
};

export interface IMeshFace
  extends IBaseObject,
    IMaterialFriendly,
    IPassableObject {
  vertices?: number[];
  normals?: number[];
  texcoords?: number[];
  smoothbounce?: boolean;
  noclusters?: boolean;
}

export function newIMeshFace(): IMeshFace {
  return {
    ...newIBaseObject('face'),
    ...newIPassableObject(),
    _terminator: 'endface',
    drivethrough: false,
    shootthrough: false,
  };
}
