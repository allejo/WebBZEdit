import { WorldEditorHelper } from './WorldEditorHelper';

export function enableJumping(this: WorldEditorHelper, enabled: boolean): void {
	this.world._options['-j'] = enabled;
}

export function isJumpingEnabled(this: WorldEditorHelper): boolean {
	return !!this.world._options['-j'];
}

export function enableRicochets(
	this: WorldEditorHelper,
	enabled: boolean,
): void {
	this.world._options['+r'] = enabled;
}

export function areRicochetsEnabled(this: WorldEditorHelper): boolean {
	return !!this.world._options['+r'];
}
