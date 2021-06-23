import { INameable } from '../Attributes/INameable';
import { IPositionable } from '../Attributes/IPositionable';
import { bzwFloat, bzwVector3F } from '../attributeParsers';
import { IBaseObject, newIBaseObject } from './BaseObject';
import { ITeleporterLink } from './TeleporterLink';

export const TeleporterProperties = {
  position: bzwVector3F,
  size: bzwVector3F,
  rotation: bzwFloat,
  border: bzwFloat,
};

export interface ITeleporter extends IBaseObject, INameable, IPositionable {
  border: number;
  _links: ITeleporterLink[];
}

export function newITeleporter(): ITeleporter {
  return {
    ...newIBaseObject('teleporter'),
    name: 'teleporter',
    position: [0, 0, 0],
    size: [0.56, 6.72, 21.28],
    rotation: 0,
    border: 1.12,
    _links: [],
  };
}
