import React from 'react';
import { useLoader } from 'react-three-fiber';
import { RepeatWrapping, Texture, TextureLoader } from 'three';

import { IBox } from '../Document/Obstacles/Box';
import SkinnableBox from './Abstract/SkinnableBox';

import boxWall from '../assets/boxwall.png';
import boxRoof from '../assets/roof.png';

interface Props {
  obstacle: IBox;
  isSelected: boolean;
  onClick: (obstacle: IBox) => void;
}

/**
 * @constructor
 * @see https://threejs.org/docs/#api/en/geometries/BoxGeometry
 */
const Box = ({ obstacle, onClick }: Props) => {
  const { position, size, rotation = 0 } = obstacle;
  const [bzwSizeX, bzwSizeY, bzwSizeZ] = size;
  const handleOnClick = () => onClick(obstacle);

  const [roofTexture, wallTexture] = useLoader<Texture[]>(TextureLoader, [
    boxRoof,
    boxWall,
  ]);

  roofTexture.wrapS = roofTexture.wrapT = RepeatWrapping;
  wallTexture.wrapS = wallTexture.wrapT = RepeatWrapping;

  roofTexture.repeat.set(bzwSizeX / 2, bzwSizeY / 2);

  const xTexture = wallTexture;
  const yTexture = wallTexture.clone();

  xTexture.repeat.set(bzwSizeZ / 4, bzwSizeZ / 7.5);
  xTexture.needsUpdate = true;

  yTexture.repeat.set(bzwSizeY / 4, bzwSizeZ / 7.5);
  yTexture.needsUpdate = true;

  return (
    <SkinnableBox
      position={position}
      size={size}
      rotation={rotation}
      onClick={handleOnClick}
      topMaterial={roofTexture}
      botMaterial={roofTexture}
      xPosMaterial={wallTexture}
      xNegMaterial={wallTexture}
      yPosMaterial={wallTexture}
      yNegMaterial={wallTexture}
    />
  );
};

export default Box;
export type { Props as IBoxProps };
