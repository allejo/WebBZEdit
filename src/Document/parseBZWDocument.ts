import { nanoid } from 'nanoid';

import { Stack } from '../Utilities/Stack';
import {
	bzwString,
	Hashable,
	HashableParserCallback,
	Repeatable,
	RepeatableParserCallback,
} from './attributeParsers';
import { BaseProperties, newIBase } from './Obstacles/Base';
import { IBaseObject } from './Obstacles/BaseObject';
import { BoxProperties, newIBox } from './Obstacles/Box';
import { MaterialProperties, newIMaterial } from './Obstacles/Material';
import { MeshProperties, newIMesh } from './Obstacles/Mesh';
import { MeshFaceProperties, newIMeshFace } from './Obstacles/MeshFace';
import { IOptions, newIOptions, OptionsProperties } from './Obstacles/Option';
import { newIPyramid, PyramidProperties } from './Obstacles/Pyramid';
import {
	ITeleporter,
	newITeleporter,
	TeleporterProperties,
} from './Obstacles/Teleporter';
import {
	ITeleporterLink,
	newITeleporterLink,
	TeleporterLinkProperties,
} from './Obstacles/TeleporterLink';
import {
	newITextureMatrix,
	TextureMatrixProperties,
} from './Obstacles/TextureMatrix';
import { IWorld, newIWorld, WorldProperties } from './Obstacles/World';
import { IZone, newIZone, ZoneProperties } from './Obstacles/Zone';

type ObjectBuilder = {
	factory: () => IBaseObject & any;
	parsers: Record<
		string,
		| HashableParserCallback<any, any>
		| Hashable<any, any>
		| RepeatableParserCallback<any>
		| Repeatable<any>
	>;
	onObstacleBegin: (
		infoString: string,
		obstacle: IBaseObject & any,
		world: IWorld,
	) => void;
	onObstacleComplete: (obstacle: IBaseObject & any, world: IWorld) => void;
};

const noop = () => {};

const ObjectBuilders: Record<string, ObjectBuilder> = {
	base: {
		factory: newIBase,
		parsers: BaseProperties,
		onObstacleBegin: noop,
		onObstacleComplete: noop,
	},
	box: {
		factory: newIBox,
		parsers: BoxProperties,
		onObstacleBegin: noop,
		onObstacleComplete: noop,
	},
	face: {
		factory: newIMeshFace,
		parsers: MeshFaceProperties,
		onObstacleBegin: noop,
		onObstacleComplete: noop,
	},
	link: {
		factory: newITeleporterLink,
		parsers: TeleporterLinkProperties,
		onObstacleBegin: noop,
		onObstacleComplete: (link: ITeleporterLink, world) => {
			// after parsing a Link object, associate it with relevant teleporters
			for (const teleUUID of world._teleporters) {
				const tele = world.children[teleUUID] as ITeleporter;

				if (tele.name === link.from.name || tele.name === link.to.name) {
					tele._links.push(link._uuid);
				}
			}
		},
	},
	material: {
		factory: newIMaterial,
		parsers: MaterialProperties,
		onObstacleBegin: noop,
		onObstacleComplete: noop,
	},
	mesh: {
		factory: newIMesh,
		parsers: MeshProperties,
		onObstacleBegin: noop,
		onObstacleComplete: noop,
	},
	options: {
		factory: newIOptions,
		parsers: OptionsProperties,
		onObstacleBegin: noop,
		onObstacleComplete: (options: IOptions, world) => {
			world._options = options;

			// Don't save the `options` block as a child, treat it special as the
			// `_options` property
			delete world.children[options._uuid];
		},
	},
	pyramid: {
		factory: newIPyramid,
		parsers: PyramidProperties,
		onObstacleBegin: noop,
		onObstacleComplete: noop,
	},
	teleporter: {
		factory: newITeleporter,
		parsers: TeleporterProperties,
		onObstacleBegin: (infoString, obstacle: ITeleporter, world) => {
			obstacle.name = infoString;

			// teleporter didn't have a name; so give it one
			if (obstacle.name === '') {
				obstacle.name = `tele${world._teleporters.length}`;
			}

			// keep track of teleporter objects so we can associate their links later
			world._teleporters.push(obstacle._uuid);
		},
		onObstacleComplete: noop,
	},
	texturematrix: {
		factory: newITextureMatrix,
		parsers: TextureMatrixProperties,
		onObstacleBegin: noop,
		onObstacleComplete: noop,
	},
	world: {
		factory: newIWorld,
		parsers: WorldProperties,
		onObstacleBegin: noop,
		onObstacleComplete: noop,
	},
	zone: {
		factory: newIZone,
		parsers: ZoneProperties,
		onObstacleBegin: noop,
		onObstacleComplete: (zone: IZone) => {
			zone.flag = zone.flag.flat(2);
		},
	},
};

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
