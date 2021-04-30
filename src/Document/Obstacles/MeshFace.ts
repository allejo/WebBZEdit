import { BaseObject } from './BaseObject';
import { bzwBool, bzwIntVector, bzwString } from '../attributeParsers';
import { IMaterialFriendly, IPassableObject } from './partials';

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

export interface IMeshFace extends IMaterialFriendly, IPassableObject {
  vertices?: number[];
  normals?: number[];
  texcoords?: number[];
  smoothbounce?: boolean;
  noclusters?: boolean;
}

export class MeshFace extends BaseObject {
  protected endTerminator = 'endface';

  objectType = 'face';
  definitions = MeshFaceProperties;

  vertices?: number[];
  normals?: number[];
  texcoords?: number[];
  smoothbounce?: boolean;
  noclusters?: boolean;
  phydrv?: string;
  matref?: string;
  drivethrough: boolean = false;
  shootthrough: boolean = false;

  get passable(): boolean {
    return this.drivethrough && this.shootthrough;
  }

  set passable(value: boolean) {
    this.drivethrough = value;
    this.shootthrough = value;
  }
}
