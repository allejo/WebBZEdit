import { OmitIndexSignature } from 'type-fest';

import { Vector3F, Vector4F } from '../Utilities/contracts';
import { assertNotNull } from '../Utilities/developmentUtilities';
import { IBaseObject } from './Obstacles/BaseObject';
import {
	TeleporterReference,
	TeleporterSide,
} from './Obstacles/TeleporterLink';
import { IWorld } from './Obstacles/World';

export type BZWParseLine<R> = (line: string, world: IWorld) => R;

type KeyType = number | string | symbol;

export type HashableParserCallback<K extends KeyType, V> = (
	line: string,
	world: IWorld,
) => [K, V];

export interface Hashable<K extends KeyType, V> {
	type: 'hashable';
	callback: HashableParserCallback<K, V>;
}

export function bzwHashable<K extends KeyType, V>(
	cb: Hashable<K, V>['callback'],
): Hashable<K, V> {
	return {
		type: 'hashable',
		callback: cb,
	};
}

export type RepeatableParserCallback<T> = (line: string, world: IWorld) => T;

export interface Repeatable<T> {
	type: 'repeatable';
	callback: RepeatableParserCallback<T>;
}

export const bzwRepeatable = <T>(
	cb: Repeatable<T>['callback'],
): Repeatable<T> => ({
	type: 'repeatable',
	callback: cb,
});

export const bzwBool: BZWParseLine<boolean> = () => {
	return true;
};

export const bzwFloat: BZWParseLine<number> = (line) => {
	return Number.parseFloat(line);
};

export const bzwInt: BZWParseLine<number> = (line) => {
	return Number.parseInt(line);
};

export const bzwString: BZWParseLine<string> = (line) => {
	// Only use any string value before the `#`; i.e. the non-comment content
	return line.match(/([^#\n]+)(?!#)/)?.[0] ?? line;
};

export const bzwStringVector: BZWParseLine<string[]> = (line, world) => {
	return bzwString(line, world).split(/[ ]+/);
};

export const bzwIntVector: BZWParseLine<number[]> = (line, world) => {
	return bzwStringVector(line, world).map((value) => Number.parseInt(value));
};

export const bzwFloatVector: BZWParseLine<number[]> = (line, world) => {
	return bzwStringVector(line, world).map((value) => Number.parseFloat(value));
};

export const bzwVector3F: BZWParseLine<Vector3F> = (line) => {
	const tokens = line.split(/[ ]+/);

	return [
		Number.parseFloat(tokens[0]),
		Number.parseFloat(tokens[1]),
		Number.parseFloat(tokens[2]),
	];
};

export const bzwVector4F: BZWParseLine<Vector4F> = (line) => {
	const tokens = line.split(/[ ]+/);

	return [
		Number.parseFloat(tokens[0]),
		Number.parseFloat(tokens[1]),
		Number.parseFloat(tokens[2]),
		Number.parseFloat(tokens[3]),
	];
};

export const bzwTeleRef: BZWParseLine<TeleporterReference> = (line, world) => {
	assertNotNull(world, 'This function requires "world" to be given.');

	let name = line;
	let side = TeleporterSide.Both;
	const i = line.lastIndexOf(':');

	if (i !== -1) {
		name = line.substring(0, i);

		const sideStr = line.substring(i + 1);
		if (sideStr === 'f') {
			side = TeleporterSide.Forward;
		} else if (sideStr === 'b') {
			side = TeleporterSide.Backward;
		}
	} else if (!isNaN(+name)) {
		// teleporter reference was defined as a single number
		// determine which teleporter and side is being referenced
		const teleIndex = Math.floor(+name / 2),
			sideIndex = +name % 2;

		name = world.children[world._teleporters[teleIndex]].name ?? '';
		side = sideIndex === 0 ? TeleporterSide.Forward : TeleporterSide.Backward;
	}

	return {
		name: name,
		side: side,
	};
};

export type BZWParserFunction<T> =
	| ReturnType<typeof bzwHashable<KeyType, T>>
	| ReturnType<typeof bzwRepeatable<T>>
	| BZWParseLine<T>;

export type BZWObjectProperties<T> = {
	[key in keyof T]: NonNullable<T[key]> extends Array<infer U>
		? Repeatable<U>
		: BZWParserFunction<NonNullable<T[key]>>;
};
