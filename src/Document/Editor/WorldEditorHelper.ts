import { IWorld } from '../Obstacles/World';
import { getFriendlyFire, setFriendlyFire } from './FriendlyFireEditor';
import { getGameMode, setGameMode } from './GameModeEditor';
import {
	areRicochetsEnabled,
	enableJumping,
	enableRicochets,
	isJumpingEnabled,
} from './GameplayEditor';
import { addObstacle, delObstacle, renameObstacle } from './ObstacleEditor';
import {
	addLink,
	addLinks,
	clearTeleporterCache,
	delLink,
	delLinks,
} from './TeleporterEditor';

/**
 * A helper class that takes in an IWorld object and allows for easily editing
 * it by managing references between objects.
 *
 * Generally, it is inexpensive to create new instances of this class for quick
 * edits and does not need to be shared between scopes. However, if you are
 * editing objects that have references such as teleporters with links or
 * obstacles with materials, then it is crucial to share that instance as much
 * as possible; this class will create internal caches of references when
 * working with them and recreating these caches can become expensive with
 * larger maps.
 */
export class WorldEditorHelper {
	constructor(protected world: IWorld) {}

	// Obstacle Management
	public addObstacle = addObstacle;
	public delObstacle = delObstacle;
	public renameObstacle = renameObstacle;

	// Link Management
	public addLink = addLink;
	public addLinks = addLinks;
	public delLink = delLink;
	public delLinks = delLinks;
	public clearTeleporterCache = clearTeleporterCache;

	// Gameplay Management
	public getGameMode = getGameMode;
	public setGameMode = setGameMode;
	public enableJumping = enableJumping;
	public isJumpingEnabled = isJumpingEnabled;
	public enableRicochets = enableRicochets;
	public areRicochetsEnabled = areRicochetsEnabled;
	public getFriendlyFire = getFriendlyFire;
	public setFriendlyFire = setFriendlyFire;

	cleanUp = (): void => {
		this.clearTeleporterCache();
	};
}
