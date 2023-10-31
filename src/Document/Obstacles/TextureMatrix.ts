import { Vector4F } from '../../Utilities/types';
import {
	bzwFloat,
	bzwFloatVector,
	bzwString,
	bzwVector4F,
} from '../attributeParsers';
import { INameable } from '../Attributes/INameable';
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
	shift?: [number, number];
	center?: [number, number];
	fixedscale?: [number, number];
	fixedspin?: number;
	fixedshift?: [number, number];
}

export function newITextureMatrix(): ITextureMatrix {
	return {
		...newIBaseObject('texturematrix'),
		name: 'textureMatrix',
	};
}
