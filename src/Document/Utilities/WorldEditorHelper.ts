import { removeItem } from '../../Utilities/arrays';
import { assumeType } from '../../Utilities/types';
import { IBaseObject } from '../Obstacles/BaseObject';
import { ITeleporter } from '../Obstacles/Teleporter';
import { ITeleporterLink } from '../Obstacles/TeleporterLink';
import { IWorld } from '../Obstacles/World';

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
