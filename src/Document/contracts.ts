import { BZWParserFunction } from './attributeParsers';
import { BaseProperties, IBase, newIBase } from './Obstacles/Base';
import { BoxProperties, IBox, newIBox } from './Obstacles/Box';
import {
	IMaterial,
	MaterialProperties,
	newIMaterial,
} from './Obstacles/Material';
import { IMesh, MeshProperties, newIMesh } from './Obstacles/Mesh';
import {
	IMeshFace,
	MeshFaceProperties,
	newIMeshFace,
} from './Obstacles/MeshFace';
import { IOptions, newIOptions, OptionsProperties } from './Obstacles/Option';
import { IPyramid, newIPyramid, PyramidProperties } from './Obstacles/Pyramid';
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
	ITextureMatrix,
	newITextureMatrix,
	TextureMatrixProperties,
} from './Obstacles/TextureMatrix';
import { IWorld, newIWorld, WorldProperties } from './Obstacles/World';
import { IZone, newIZone, ZoneProperties } from './Obstacles/Zone';

type MapObjectTypeMappings = {
	base: IBase;
	box: IBox;
	face: IMeshFace;
	link: ITeleporterLink;
	material: IMaterial;
	mesh: IMesh;
	options: IOptions;
	pyramid: IPyramid;
	teleporter: ITeleporter;
	texturematrix: ITextureMatrix;
	world: IWorld;
	zone: IZone;
};

export type MapObjectHeader = keyof MapObjectTypeMappings;
export type MapObjectType = MapObjectTypeMappings[MapObjectHeader];

type ObjectBuilderMapping = {
	[header in MapObjectHeader]: {
		factory: () => MapObjectTypeMappings[header];
		parsers: Record<string, BZWParserFunction>;
		onObstacleBegin?: (
			infoString: string,
			obstacle: MapObjectTypeMappings[header],
			world: IWorld,
		) => void;
		onObstacleComplete?: (
			obstacle: MapObjectTypeMappings[header],
			world: IWorld,
		) => void;
	};
};

export const ObjectBuilders: ObjectBuilderMapping = {
	base: {
		factory: newIBase,
		parsers: BaseProperties,
	},
	box: {
		factory: newIBox,
		parsers: BoxProperties,
	},
	face: {
		factory: newIMeshFace,
		parsers: MeshFaceProperties,
	},
	link: {
		factory: newITeleporterLink,
		parsers: TeleporterLinkProperties,
		onObstacleComplete: (link, world) => {
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
	},
	mesh: {
		factory: newIMesh,
		parsers: MeshProperties,
	},
	options: {
		factory: newIOptions,
		parsers: OptionsProperties,
		onObstacleComplete: (options, world) => {
			world._options = options;

			// Don't save the `options` block as a child, treat it special as the
			// `_options` property
			delete world.children[options._uuid];
		},
	},
	pyramid: {
		factory: newIPyramid,
		parsers: PyramidProperties,
	},
	teleporter: {
		factory: newITeleporter,
		parsers: TeleporterProperties,
		onObstacleBegin: (infoString, obstacle, world) => {
			obstacle.name = infoString;

			// teleporter didn't have a name; so give it one
			if (obstacle.name === '') {
				obstacle.name = `tele${world._teleporters.length}`;
			}

			// keep track of teleporter objects so we can associate their links later
			world._teleporters.push(obstacle._uuid);
		},
	},
	texturematrix: {
		factory: newITextureMatrix,
		parsers: TextureMatrixProperties,
	},
	world: {
		factory: newIWorld,
		parsers: WorldProperties,
	},
	zone: {
		factory: newIZone,
		parsers: ZoneProperties,
		onObstacleComplete: (zone: IZone) => {
			zone.flag = zone.flag.flat(2);
		},
	},
};
