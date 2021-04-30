import { BaseObject } from './BaseObject';
import { bzwFloat, bzwVector3F } from '../attributeParsers';
import { IPositionable } from './partials';
import { Vector3F } from '../../Utilities/types';

export const TeleporterProperties = {
  position: bzwVector3F,
  size: bzwVector3F,
  rotation: bzwFloat,
  border: bzwFloat,
};

export interface ITeleporter extends IPositionable {
  border: number;
}

export class Teleporter extends BaseObject implements ITeleporter {
  objectType = 'teleporter';
  definitions = TeleporterProperties;

  name: string = 'teleporter';
  position: Vector3F = [0, 0, 0];
  size: Vector3F = [0.56, 6.72, 21.28];
  rotation: number = 0;
  border: number = 1.12;

  public finalize(): void {
    this.name = this.infoString;
  }
}
