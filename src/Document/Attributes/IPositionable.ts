import { Vector3F } from '../../Utilities/contracts';

export interface IPositionable {
	position: Vector3F;
	rotation?: number;
}

export function implementsIPositionable(value: object): value is IPositionable {
	return 'position' in value && 'rotation' in value;
}
