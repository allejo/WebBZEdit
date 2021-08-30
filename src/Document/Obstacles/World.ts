import { INameable } from '../Attributes/INameable';
import { bzwBool, bzwFloat, bzwString } from '../attributeParsers';
import { IBaseObject, newIBaseObject } from './BaseObject';
import { IOptions, newIOptions } from './Option';
import { ITeleporter } from './Teleporter';

export const WorldProperties = {
  name: bzwString,
  size: bzwFloat,
  flagheight: bzwFloat,
  nowalls: bzwBool,
  freectfspawns: bzwBool,
};

export interface IWorld extends IBaseObject, INameable {
  _options: IOptions;
  _teleporters: ITeleporter[];
  size: number;
  flagheight?: number;
  nowalls: boolean;
  freectfspawns: boolean;
}

export function newIWorld(): IWorld {
  return {
    ...newIBaseObject('world'),
    _options: newIOptions(),
    _teleporters: [],
    size: 800,
    nowalls: false,
    freectfspawns: false,
  };
}
