import { removeItem } from '../../Utilities/arrays';
import { slugify } from '../../Utilities/slugify';
import { assumeType } from '../../Utilities/types';
import { INameable } from '../Attributes/INameable';
import { IBaseObject } from '../Obstacles/BaseObject';
import { RabbitMode } from '../Obstacles/Option';
import { ITeleporter } from '../Obstacles/Teleporter';
import { ITeleporterLink } from '../Obstacles/TeleporterLink';
import { IWorld } from '../Obstacles/World';
import { GameMode } from './GameMode';

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
  private areLinksCached: boolean = false;
  private teleCache: Record<string, string> = {};

  constructor(private world: IWorld) {}

  addObstacle = <T extends IBaseObject>(obstacle: T) => {
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
  };

  delObstacle = <T extends IBaseObject>(obstacleOrUUID: T | string) => {
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
  };

  renameObstacle = <T extends IBaseObject & INameable>(
    obstacleOrUUID: T | string,
    proposedName: string,
  ) => {
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
  };

  addLink = (link: ITeleporterLink): this => {
    this.cacheLinks();

    const teleFromName = link.from.name;
    const teleFromUUID = this.teleCache[teleFromName];
    const teleToName = link.to.name;
    const teleToUUID = this.teleCache[teleToName];

    if (!teleFromUUID || !teleToUUID) {
      throw Error(`Invalid teleporter name: ${teleFromName}`);
    }

    const teleFrom = this.world.children[teleFromUUID] as ITeleporter;
    const teleTo = this.world.children[teleToUUID] as ITeleporter;

    if (!teleFrom || !teleTo) {
      throw Error(`Invalid teleporter UUID: ${teleFromUUID}`);
    }

    this.world.children[link._uuid] = link;
    teleFrom._links.push(link._uuid);
    teleTo._links.push(link._uuid);

    return this;
  };

  addLinks = (links: ITeleporterLink[]): this => {
    links.forEach(this.addLink);

    return this;
  };

  delLink = (linkUUID: string): this => {
    this.delLinks([linkUUID]);

    return this;
  };

  delLinks = (linkUUIDs: string[]): this => {
    this.cacheLinks();

    linkUUIDs.forEach((uuid) => {
      const link = this.world.children[uuid] as ITeleporterLink;

      const teleFromUUID = this.teleCache[link.from.name];
      const teleFrom = this.world.children[teleFromUUID] as ITeleporter;
      const teleToUUID = this.teleCache[link.to.name];
      const teleTo = this.world.children[teleToUUID] as ITeleporter;

      teleFrom._links = removeItem(teleFrom._links, uuid);
      teleTo._links = removeItem(teleFrom._links, uuid);

      delete this.world.children[uuid];
    });

    return this;
  };

  cleanUp = (): void => {
    this.clearTeleCache();
  };

  clearTeleCache = (): void => {
    this.areLinksCached = false;
    this.teleCache = {};
  };

  getGameMode = (): GameMode => {
    if (this.world._options['-c'] === true) {
      return GameMode.CaptureTheFlag;
    }

    if (this.world._options['-offa'] === true) {
      return GameMode.OpenFreeForAll;
    }

    let rabbitMode;
    if ((rabbitMode = this.world._options['-rabbit'])) {
      if (rabbitMode === RabbitMode.killer) {
        return GameMode.RabbitByKiller;
      }

      if (rabbitMode === RabbitMode.random) {
        return GameMode.RabbitByRandom;
      }

      if (rabbitMode === RabbitMode.score) {
        return GameMode.RabbitByScore;
      }
    }

    return GameMode.FreeForAll;
  };

  setGameMode = (mode: GameMode): void => {
    const gameModeOpts = ['-c', '-offa', '-rabbit'];

    for (const gameModeOpt of gameModeOpts) {
      delete this.world._options[gameModeOpt];
    }

    switch (mode) {
      case GameMode.CaptureTheFlag:
        this.world._options['-c'] = true;
        break;

      case GameMode.OpenFreeForAll:
        this.world._options['-offa'] = true;
        break;

      case GameMode.RabbitByKiller:
        this.world._options['-rabbit'] = RabbitMode.killer;
        break;

      case GameMode.RabbitByRandom:
        this.world._options['-rabbit'] = RabbitMode.random;
        break;

      case GameMode.RabbitByScore:
        this.world._options['-rabbit'] = RabbitMode.score;
        break;

      default:
        break;
    }
  };

  private cacheLinks = (): void => {
    if (this.areLinksCached) {
      return;
    }

    this.world._teleporters.forEach((teleUUID) => {
      const teleporter = this.world.children[teleUUID] as ITeleporter;

      if (!teleporter) {
        return;
      }

      this.teleCache[teleporter.name!] = teleUUID;
    });

    this.areLinksCached = true;
  };
}
