import {
	bzwBool,
	bzwFloat,
	BZWObjectProperties,
	bzwString,
	bzwVector3F,
} from '../attributeParsers';
import { IMaterialFriendly } from '../Attributes/IMaterialFriendly';
import { INameable } from '../Attributes/INameable';
import {
	IPassableObject,
	newIPassableObject,
} from '../Attributes/IPassableObject';
import { IPhysicsDriverFriendly } from '../Attributes/IPhysicsDriverFriendly';
import { IPositionable } from '../Attributes/IPositionable';
import { ISizeable } from '../Attributes/ISizeable';
import { IBaseObject, newIBaseObject } from './BaseObject';

export const BoxProperties: BZWObjectProperties<IBox> = {
	name: bzwString,
	position: bzwVector3F,
	size: bzwVector3F,
	rotation: bzwFloat,
	matref: bzwString,
	phydrv: bzwString,
	drivethrough: bzwBool,
	shootthrough: bzwBool,
};

export interface IBox
	extends IBaseObject,
		IMaterialFriendly,
		INameable,
		IPassableObject,
		IPositionable,
		IPhysicsDriverFriendly,
		ISizeable {}

export function newIBox(): IBox {
	return {
		...newIBaseObject('box'),
		...newIPassableObject(),
		position: [0, 0, 0],
		size: [5, 5, 5],
		rotation: 0,
	};
}
