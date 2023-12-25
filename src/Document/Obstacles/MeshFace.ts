import {
	bzwBool,
	bzwIntVector,
	BZWObjectProperties,
	bzwString,
} from '../attributeParsers';
import { IMaterialFriendly } from '../Attributes/IMaterialFriendly';
import {
	IPassableObject,
	newIPassableObject,
} from '../Attributes/IPassableObject';
import { IBaseObject, newIBaseObject } from './BaseObject';

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

export const MeshFaceProperties: BZWObjectProperties<IMeshFace> = {
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

export function newIMeshFace(): IMeshFace {
	return {
		...newIBaseObject('face'),
		...newIPassableObject(),
		_terminator: 'endface',
		drivethrough: false,
		shootthrough: false,
	};
}
