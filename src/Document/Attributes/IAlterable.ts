import { implementsIPositionable, IPositionable } from './IPositionable';
import { implementsISizeable, ISizeable } from './ISizeable';

export type IAlterable = IPositionable & ISizeable;

export function implementsIAlterable(value: object): value is IAlterable {
	return implementsIPositionable(value) && implementsISizeable(value);
}
