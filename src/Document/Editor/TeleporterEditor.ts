import { removeItem } from '../../Utilities/arrays';
import { ITeleporter } from '../Obstacles/Teleporter';
import { ITeleporterLink } from '../Obstacles/TeleporterLink';
import { IWorld } from '../Obstacles/World';
import { WorldEditorHelper } from './WorldEditorHelper';

let areLinksCached: boolean = false;
let teleCache: Record<string, string> = {};

export function addLink(this: WorldEditorHelper, link: ITeleporterLink) {
  cacheLinks(this.world);

  const teleFromName = link.from.name;
  const teleFromUUID = teleCache[teleFromName];
  const teleToName = link.to.name;
  const teleToUUID = teleCache[teleToName];

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
}

export function addLinks(this: WorldEditorHelper, links: ITeleporterLink[]) {
  links.forEach((link) => this.addLink(link));

  return this;
}

export function delLink(this: WorldEditorHelper, linkUUID: string) {
  this.delLinks([linkUUID]);

  return this;
}

export function delLinks(this: WorldEditorHelper, linkUUIDs: string[]) {
  cacheLinks(this.world);

  linkUUIDs.forEach((uuid) => {
    const link = this.world.children[uuid] as ITeleporterLink;

    const teleFromUUID = teleCache[link.from.name];
    const teleFrom = this.world.children[teleFromUUID] as ITeleporter;
    const teleToUUID = teleCache[link.to.name];
    const teleTo = this.world.children[teleToUUID] as ITeleporter;

    teleFrom._links = removeItem(teleFrom._links, uuid);
    teleTo._links = removeItem(teleFrom._links, uuid);

    delete this.world.children[uuid];
  });

  return this;
}

export function clearTeleporterCache(this: WorldEditorHelper): void {
  areLinksCached = false;
  teleCache = {};
}

function cacheLinks(world: IWorld): void {
  if (areLinksCached) {
    return;
  }

  world._teleporters.forEach((teleUUID) => {
    const teleporter = world.children[teleUUID] as ITeleporter;

    if (!teleporter) {
      return;
    }

    teleCache[teleporter.name!] = teleUUID;
  });

  areLinksCached = true;
}
