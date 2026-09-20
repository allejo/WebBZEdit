import { AttributeParsers, bzwBool } from '../attributeParsers';
import { newIBaseObject } from './BaseObject';
import { ConeProperties, ICone } from './Cone';

export const MeshPyramidProperties: AttributeParsers<MeshPyramid> = {
  ...ConeProperties,
  flipz: bzwBool,
};

export interface MeshPyramid extends ICone {
  flipz: boolean;
}

export function newMeshPyramid(): MeshPyramid {
  return {
    ...newIBaseObject('meshpyr'),
    position: [0, 0, 0],
    size: [
      // 4.0*_tankHeight"
      4.0 * 2.05,
      4.0 * 2.05,
      // 5.0*_tankHeight
      5.0 * 2.05,
    ],
    divisions: 4,
    flatshading: true,
    flipz: true,
    'edge matref': 'pyrwall',
    'bottom matref': 'pyrwall',
    'startside matref': 'pyrwall',
    'endside matref': 'pyrwall',
  };
}
