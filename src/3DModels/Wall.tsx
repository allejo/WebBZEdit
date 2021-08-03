import React, { useMemo } from 'react';
import { useLoader } from 'react-three-fiber';
import { RepeatWrapping, Texture, TextureLoader } from 'three';

import SkinnableBox from './Abstract/SkinnableBox';

import worldWall from '../assets/wall.png';

export enum Direction {
  North,
  South,
  East,
  West,
}

interface Props {
  direction: Direction;
  wallHeight: number;
  worldSize: number;
}

const Wall = ({ direction, wallHeight, worldSize }: Props) => {
  const noop = () => {};
  const [wallTexture] = useLoader<Texture[]>(TextureLoader, [worldWall]);

  const position: [number, number, number] = useMemo(() => {
    switch (direction) {
      case Direction.North:
        return [0, worldSize, 0];

      case Direction.South:
        return [0, -worldSize, 0];

      case Direction.East:
        return [worldSize, 0, 0];

      case Direction.West:
        return [-worldSize, 0, 0];

      default:
        return [0, 0, 0];
    }
  }, [direction, worldSize]);
  const rotation: number = useMemo(() => {
    switch (direction) {
      case Direction.North:
      case Direction.South:
        return 0;

      default:
        return 90;
    }
  }, [direction]);

  wallTexture.wrapS = wallTexture.wrapT = RepeatWrapping;
  wallTexture.repeat.set(worldSize / 10, wallHeight / 10);
  wallTexture.needsUpdate = true;

  return (
    <SkinnableBox
      position={position}
      size={[worldSize, 0.01, wallHeight]}
      rotation={rotation}
      onClick={noop}
      topMaterial={wallTexture}
      botMaterial={wallTexture}
      xPosMaterial={wallTexture}
      xNegMaterial={wallTexture}
      yPosMaterial={wallTexture}
      yNegMaterial={wallTexture}
    />
  );
};

export default Wall;
export type { Props as IWallProps };
