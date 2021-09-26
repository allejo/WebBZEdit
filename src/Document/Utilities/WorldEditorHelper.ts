import { ITeleporter } from '../Obstacles/Teleporter';
import { ITeleporterLink } from '../Obstacles/TeleporterLink';
import { IWorld } from '../Obstacles/World';

interface LinkCache {
  owner: string;
  index: number;
}

export class WorldEditorHelper {
  private areLinksCached: boolean = false;
  private linkCache: Record<string, LinkCache> = {};
  private teleCache: Record<string, string> = {};

  constructor(private world: IWorld) {}

  addLink(link: ITeleporterLink): this {
    this.cacheLinks();

    const teleName = link.from.name;
    const teleUUID = this.teleCache[teleName];

    if (!teleUUID) {
      throw Error(`Invalid teleporter name: ${teleName}`);
    }

    const teleporter = this.world.children[teleUUID] as ITeleporter;

    if (!teleporter) {
      throw Error(`Invalid teleporter UUID: ${teleUUID}`);
    }

    this.world.children[link._uuid] = link;
    teleporter._links.push(link._uuid);

    return this;
  }

  addLinks(links: ITeleporterLink[]): this {
    links.forEach(this.addLink);

    return this;
  }

  delLink(linkUUID: string): this {
    this.cacheLinks();
    this.delLinks([linkUUID]);

    return this;
  }

  delLinks(linkUUIDs: string[]): this {
    this.cacheLinks();

    linkUUIDs.forEach((uuid) => {
      delete this.world.children[uuid];

      const mapCache = this.linkCache[uuid];
      this.world.children[mapCache.owner]._links[mapCache.index] = null;
    });

    return this;
  }

  cleanUp(): void {
    this.world._teleporters.forEach((teleUUID) => {
      const teleporter = this.world.children[teleUUID] as ITeleporter;
      teleporter._links = teleporter._links.filter(Boolean);

      this.world.children[teleUUID] = teleporter;
    });

    this.areLinksCached = false;
  }

  private cacheLinks(): void {
    if (this.areLinksCached) {
      return;
    }

    this.world._teleporters.forEach((teleUUID) => {
      const teleporter = this.world.children[teleUUID] as ITeleporter;

      if (!teleporter) {
        return;
      }

      this.teleCache[teleporter.name!] = teleUUID;
      teleporter._links.forEach((uuid, index) => {
        const link = this.world.children[uuid] as ITeleporterLink;

        if (teleUUID !== this.teleCache[link.from.name]) {
          return;
        }

        this.linkCache[uuid] = {
          owner: teleUUID,
          index: index,
        };
      });
    });

    this.areLinksCached = true;
  }
}
