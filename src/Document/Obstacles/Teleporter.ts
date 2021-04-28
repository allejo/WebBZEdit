import { BaseObject } from './BaseObject';
import { bzwFloat, bzwVector3F } from '../attributeParsers';

export class Teleporter extends BaseObject {
  objectType = 'teleporter';
  definitions = {
    position: bzwVector3F,
    rotation: bzwFloat,
    size: bzwVector3F,
    border: bzwFloat,
  };

  public finalize(): void {
    this.attributes.name = this.infoString;
  }
}
