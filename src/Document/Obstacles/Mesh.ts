import { BaseObject } from './BaseObject';
import {
  bzwBool,
  bzwFloatVector,
  bzwRepeatable,
  bzwString,
  bzwVector3F,
} from '../attributeParsers';
import { MeshFace } from './MeshFace';

export class Mesh extends BaseObject {
  objectType = 'mesh';
  definitions = {
    name: bzwString,
    inside: bzwRepeatable(bzwVector3F),
    outside: bzwRepeatable(bzwVector3F),
    vertex: bzwRepeatable(bzwVector3F),
    normal: bzwRepeatable(bzwFloatVector),
    texcoord: bzwRepeatable(bzwFloatVector),
    shift: bzwRepeatable(bzwVector3F),
    scale: bzwRepeatable(bzwVector3F),
    shear: bzwRepeatable(bzwVector3F),
    spin: bzwRepeatable(bzwFloatVector),
    phydrv: bzwString,
    smoothbounce: bzwBool,
    noclusters: bzwBool,
  };

  get faces(): MeshFace[] {
    return this.children as MeshFace[];
  }
}
