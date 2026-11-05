import { Vector2F } from '../../Utilities/types';
import {
  IMaterialFriendly,
  MaterialFriendlyProperties,
} from '../Attributes/IMaterialFriendly';
import { INameable, NameableProperties } from '../Attributes/INameable';
import {
  IPassableObject,
  newIPassableObject,
} from '../Attributes/IPassableObject';
import {
  IPhysicsDriverFriendly,
  PhysicsDriverFriendlyProperties,
} from '../Attributes/IPhysicsDriverFriendly';
import {
  IPositionable,
  PositionableProperties,
} from '../Attributes/IPositionable';
import { ISizeable, SizeableProperties } from '../Attributes/ISizeable';
import {
  ITransformable,
  TransformableProperties,
} from '../Attributes/ITransformable';
import {
  AttributeParsers,
  bzwBool,
  bzwFloat,
  bzwInt,
  bzwString,
  bzwVector2F,
} from '../attributeParsers';
import { IBaseObject, newIBaseObject } from './BaseObject';

export enum ConeSideNames {
  Edge = 'edge',
  Bottom = 'bottom',
  StartSide = 'startside',
  EndSide = 'endside',
}

export const ConeDefaults = {
  divisions: 16,
  flatshading: true,
  angle: 360,
  texsize: [-8, -8] as Vector2F,
  'edge matref': 'boxwall',
  'bottom matref': 'roof',
  'startside matref': 'wall',
  'endside matref': 'wall',
} as const;

export const ConeProperties: AttributeParsers<ICone> = {
  ...TransformableProperties,
  ...NameableProperties,
  ...PositionableProperties,
  ...SizeableProperties,
  ...PhysicsDriverFriendlyProperties,
  ...MaterialFriendlyProperties,
  divisions: bzwInt,
  flatshading: bzwBool,
  angle: bzwFloat,
  texsize: bzwVector2F,
  smoothbounce: bzwBool,
  [`${ConeSideNames.Edge} matref`]: bzwString,
  [`${ConeSideNames.Bottom} matref`]: bzwString,
  [`${ConeSideNames.StartSide} matref`]: bzwString,
  [`${ConeSideNames.EndSide} matref`]: bzwString,
};

export interface ICone
  extends IBaseObject,
    IMaterialFriendly,
    INameable,
    IPhysicsDriverFriendly,
    IPassableObject,
    IPositionable,
    ISizeable,
    ITransformable {
  divisions: number;
  angle?: number;
  texsize?: Vector2F;
  smoothbounce?: boolean;
  flatshading?: boolean;
}

export function newICone(): ICone {
  return {
    ...newIBaseObject('cone'),
    ...newIPassableObject(),
    ...ConeDefaults,
    position: [0, 0, 0],
    size: [10, 10, 10],
  };
}
