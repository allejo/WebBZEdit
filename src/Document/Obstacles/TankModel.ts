import { IPositionable } from '../Attributes/IPositionable';
import { IBaseObject, newIBaseObject } from './BaseObject';

export const ITankModelObjectType = '__tank';

export interface ITankModel extends IBaseObject, IPositionable {}

export function newITankModel(): ITankModel {
  return {
    ...newIBaseObject(ITankModelObjectType, ITankModelObjectType),
    name: 'Scale Tank Model',
    position: [0, 0, 0],
    rotation: 0,
  };
}
