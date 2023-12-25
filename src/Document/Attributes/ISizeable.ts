import { Vector3F } from '../../Utilities/contracts';

export interface ISizeable {
	size: Vector3F;
}

export function implementsISizeable(value: object): value is ISizeable {
	return 'size' in value;
}
