import { removeItem } from '../../Utilities/arrays';
import { slugify } from '../../Utilities/slugify';
import { assumeType } from '../../Utilities/types';
import { INameable } from '../Attributes/INameable';
import { IBaseObject } from '../Obstacles/BaseObject';
import { ITeleporter } from '../Obstacles/Teleporter';
import { ITeleporterLink } from '../Obstacles/TeleporterLink';
import { WorldEditorHelper } from './WorldEditorHelper';

export function addObstacle<T extends IBaseObject>(
	this: WorldEditorHelper,
	obstacle: T,
) {
	if (obstacle._objectType === 'link') {
		assumeType<ITeleporterLink>(obstacle);
		this.addLink(obstacle);

		return;
	}

	if (obstacle._objectType === 'teleporter') {
		assumeType<ITeleporter>(obstacle);

		obstacle.name = 'tele' + this.world._teleporters.length;
		this.world._teleporters.push(obstacle._uuid);
	}

	this.world.children[obstacle._uuid] = obstacle;
}

export function delObstacle<T extends IBaseObject>(
	this: WorldEditorHelper,
	obstacleOrUUID: T | string,
) {
	const obstacle =
		typeof obstacleOrUUID === 'string'
			? this.world.children[obstacleOrUUID]
			: obstacleOrUUID;

	if (obstacle._objectType === 'link') {
		assumeType<ITeleporterLink>(obstacle);
		this.delLink(obstacle._uuid);

		return;
	}

	if (obstacle._objectType === 'teleporter') {
		assumeType<ITeleporter>(obstacle);

		this.delLinks(obstacle._links);
		this.world._teleporters = removeItem(
			this.world._teleporters,
			obstacle._uuid,
		);
	}

	delete this.world.children[obstacle._uuid];
}

export function renameObstacle<T extends IBaseObject & INameable>(
	this: WorldEditorHelper,
	obstacleOrUUID: T | string,
	proposedName: string,
) {
	const obstacle =
		typeof obstacleOrUUID === 'string'
			? this.world.children[obstacleOrUUID]
			: obstacleOrUUID;
	let name = proposedName;

	if (obstacle._objectType === 'teleporter') {
		assumeType<ITeleporter>(obstacle);

		name = slugify(name);

		if (name.trim().length === 0) {
			name = `tele${this.world._teleporters.length}`;
		}

		obstacle._links.forEach((uuid) => {
			const link = this.world.children[uuid] as ITeleporterLink;

			if (link.from.name === obstacle.name) {
				link.from.name = name;
			} else if (link.to.name === obstacle.name) {
				link.to.name = name;
			}
		});
	}

	this.world.children[obstacle._uuid].name = name;
}
