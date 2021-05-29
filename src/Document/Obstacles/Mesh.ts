import { Vector3F } from '../../Utilities/types';
import {
  bzwBool,
  bzwFloatVector,
  bzwRepeatable,
  bzwString,
  bzwVector3F,
} from '../attributeParsers';
import { IBaseObject, newIBaseObject } from './BaseObject';
import { IMeshFace } from './MeshFace';
import { IPhysicsDriverFriendly } from '../Attributes/IPhysicsDriverFriendly';
import { INameable } from '../Attributes/INameable';

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

export interface IMesh extends IBaseObject, INameable, IPhysicsDriverFriendly {
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

export function newIMesh(): IMesh {
  return {
    ...newIBaseObject('mesh'),
    get faces(): IMeshFace[] {
      return Object.values(this.children) as IMeshFace[];
    },
  };
}
