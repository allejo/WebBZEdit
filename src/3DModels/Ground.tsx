import { useLoader } from '@react-three/fiber';
import React from 'react';
import { RepeatWrapping, TextureLoader } from 'three';

import SkinnableBox from './Abstract/SkinnableBox';

import grass from '../assets/grass.png';

interface Props {
  worldSize: number;
}

const Ground = ({ worldSize }: Props) => {
  const noop = () => {};
  const [grassTexture] = useLoader(TextureLoader, [grass]);

  grassTexture.wrapS = grassTexture.wrapT = RepeatWrapping;
  grassTexture.repeat.set(worldSize / 10, worldSize / 10);
  grassTexture.needsUpdate = true;

  return (
    <SkinnableBox
      position={[0, 0, 0]}
      size={[worldSize, worldSize, 0.01]}
      rotation={0}
      onClick={noop}
      topTexture={grassTexture}
      botTexture={grassTexture}
      xPosTexture={grassTexture}
      xNegTexture={grassTexture}
      yPosTexture={grassTexture}
      yNegTexture={grassTexture}
    />
  );
};

export default Ground;
export type { Props as IGroundProps };
