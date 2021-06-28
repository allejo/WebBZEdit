import { IBaseObject } from '../Obstacles/BaseObject';
import { ITeleporter } from '../Obstacles/Teleporter';
import { TeleporterReference } from '../Obstacles/TeleporterLink';

export const AttributePriority: Record<string, Record<string, number>> = {
  _global: {
    name: -1,
    drivethrough: 50,
    shootthrough: 51,
    passable: 52,
    matref: 60,
  },
  mesh: {
    children: 100,
  },
};

export const HeaderWriters: Record<string, (o: IBaseObject & any) => string> = {
  teleporter: (tele: ITeleporter) => `${tele._objectType} ${tele.name}`,
};

export const AttributeWriters: Record<
  string,
  Record<string, (v: any) => string>
> = {
  link: {
    from: (r: TeleporterReference) => `from ${r.name}:${r.side}`,
    to: (r: TeleporterReference) => `to ${r.name}:${r.side}`,
  },
};

export const FooterWriters: typeof HeaderWriters = {};

export const IgnoredAttributes: Record<string, string[]> = {
  _global: [],
  face: [], // Mesh Face
  mesh: ['faces'],
  teleporter: ['name'],
};
