import { BaseObject } from './BaseObject';
import { parseFloat, parseVector3F } from '../attributeParsers';

export class Teleporter extends BaseObject {
  objectType = 'teleporter';
  definitions = {
    position: parseVector3F,
    rotation: parseFloat,
    size: parseVector3F,
    border: parseFloat,
  };

  public finalize(): void {
    this.attributes.name = this.infoString;
  }
}
