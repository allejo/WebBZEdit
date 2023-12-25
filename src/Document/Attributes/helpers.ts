import { IAlterable } from './IAlterable';
import { implementsIPositionable, IPositionable } from './IPositionable';
import { implementsISizeable } from './ISizeable';

export function canUseAlterableControlToolbox(
	value: object,
): value is IPositionable | IAlterable {
	const isPositionable = implementsIPositionable(value);
	const isISizeable = implementsISizeable(value);

	return isPositionable || (isPositionable && isISizeable);
}
