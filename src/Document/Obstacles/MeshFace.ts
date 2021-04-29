import { BaseObject } from './BaseObject';
import { bzwBool, bzwIntVector, bzwString } from '../attributeParsers';

export class MeshFace extends BaseObject {
  protected endTerminator = 'endface';

  objectType = 'face';
  definitions = {
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
}
