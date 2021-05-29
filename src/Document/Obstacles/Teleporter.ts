import { bzwFloat, bzwVector3F } from '../attributeParsers';
import { IBaseObject, newIBaseObject } from './BaseObject';
import { IPositionable } from '../Attributes/IPositionable';
import { INameable } from '../Attributes/INameable';

export const TeleporterProperties = {
  position: bzwVector3F,
  size: bzwVector3F,
  rotation: bzwFloat,
  border: bzwFloat,
};

export interface ITeleporter extends IBaseObject, INameable, IPositionable {
  border: number;
}

export function newITeleporter(): ITeleporter {
  return {
    ...newIBaseObject('teleporter'),
    name: 'teleporter',
    position: [0, 0, 0],
    size: [0.56, 6.72, 21.28],
    rotation: 0,
    border: 1.12,
  };
}
