import { Vector3F } from '../../Utilities/types';
import {
  bzwBool,
  bzwFloatVector,
  bzwRepeatable,
  bzwString,
  bzwVector3F,
} from '../attributeParsers';
import { INameable, IPhysicsDriverFriendly } from '../attributePartials';
import { BaseObject } from './BaseObject';
import { MeshFace } from './MeshFace';

export const MeshProperties = {
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

export interface IMesh extends INameable, IPhysicsDriverFriendly {
  inside?: Vector3F[];
  outside?: Vector3F[];
  vertex?: Vector3F[];
  normal?: number[];
  texcoord?: number[];
  shift?: Vector3F[];
  scale?: Vector3F[];
  shear?: Vector3F[];
  spin?: number[];
  smoothbounce?: boolean;
  noclusters?: boolean;
}

export class Mesh extends BaseObject implements IMesh {
  objectType = 'mesh';
  definitions = MeshProperties;

  name?: string;
  phydrv?: string;
  inside?: Vector3F[];
  outside?: Vector3F[];
  vertex?: Vector3F[];
  normal?: number[];
  texcoord?: number[];
  shift?: Vector3F[];
  scale?: Vector3F[];
  shear?: Vector3F[];
  spin?: number[];
  smoothbounce?: boolean;
  noclusters?: boolean;

  get faces(): MeshFace[] {
    return Object.values(this.children) as MeshFace[];
  }
}
