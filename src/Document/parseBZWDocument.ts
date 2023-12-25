import { nanoid } from 'nanoid';

import { Stack } from '../Utilities/Stack';
import { bzwString } from './attributeParsers';
import { ObjectBuilders } from './contracts';
import { IBaseObject } from './Obstacles/BaseObject';
import { IWorld, newIWorld } from './Obstacles/World';

function parseLine(line: string, object: IBaseObject, world: IWorld): void {
	const spacePos = line.search(/[ ]|$/);
	const attribute = line.substring(0, spacePos).toLowerCase();
	const restOfLine = line.substr(spacePos + 1).trim();

	const parser =
		ObjectBuilders[object._objectType].parsers[attribute] ?? bzwString;

	if (typeof parser === 'function') {
		object[attribute] = parser(restOfLine, world);
	} else {
		if (parser.type === 'repeatable') {
			if (!object[attribute]) {
				object[attribute] = [];
			}

			object[attribute].push(parser.callback(restOfLine, world));
		} else if (parser.type === 'hashable') {
			if (!object[attribute]) {
				object[attribute] = {};
			}

			const [key, value] = parser.callback(restOfLine, world);
			object[attribute][key] = value;
		}
	}
}

export function parseBZWDocument(document: string): IWorld {
	let world: IWorld = {
		...newIWorld(),
	};

	const lines = document.split('\n');
	const objStack = new Stack<IBaseObject>([world]);

	for (const _line of lines) {
		const line = _line.trim();
		const currObject: IBaseObject | null = objStack.peek();

		// It's a comment or an empty line, ignore it
		if (line[0] === '#' || line === '') {
			continue;
		}

		if (currObject && line === currObject._terminator) {
			if (objStack.peek(1)) {
				objStack.peek(1)!.children[currObject._uuid] = currObject;
			}

			ObjectBuilders[currObject._objectType].onObstacleComplete(
				currObject,
				world,
			);

			if (currObject._objectType !== 'world') {
				objStack.pop();
			}
		} else {
			const tokens = line.match(/([^ ]+)(?: (.+))?/);
			const object = (tokens?.[1] ?? '').toLocaleLowerCase();
			const infoString = tokens?.[2] ?? '';

			if (ObjectBuilders.hasOwnProperty(object)) {
				const newObject = ObjectBuilders[object].factory();
				newObject._uuid = nanoid();
				newObject._infoString = infoString;

				// We create a World object by default, but a map file can have its
				// own defined. If this is the case, let's overwrite our default one.
				if (newObject._objectType === 'world') {
					world = newObject;
					objStack.pop();
				}

				ObjectBuilders[newObject._objectType].onObstacleBegin(
					infoString,
					newObject,
					world,
				);

				objStack.push(newObject);
			} else if (currObject) {
				parseLine(line, currObject, world);
			}
		}
	}

	return world;
}
