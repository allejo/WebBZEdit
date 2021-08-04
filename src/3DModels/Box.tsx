import React from 'react';
import { useLoader } from 'react-three-fiber';
import { RepeatWrapping, TextureLoader } from 'three';

import { IBox } from '../Document/Obstacles/Box';
import SkinnableBox from './Abstract/SkinnableBox';

import boxWall from '../assets/boxwall.png';
import boxRoof from '../assets/roof.png';

interface Props {
  obstacle: IBox;
  isSelected: boolean;
  onClick: (obstacle: IBox) => void;
}

// These are magic calculations used to calculating the UV repeat values for
// objects. Applying the `uv_mapping.png` texture to BZFlag for the "boxwall"
// texture, on the BZW X/Y-axis, I get 17 squares of the texture applied to the
// side. On the BZW Z-axis, I get 8.5 out of 16 squares applied.
const XY_MULTIPLIER = 17 / 16 / 5;
const Z_MULTIPLIER = 8.5 / 16 / 5;

/**
 * @constructor
 * @see https://threejs.org/docs/#api/en/geometries/BoxGeometry
 */
const Box = ({ obstacle, isSelected, onClick }: Props) => {
  const { position, size, rotation = 0 } = obstacle;
  const [bzwSizeX, bzwSizeY, bzwSizeZ] = size;
  const handleOnClick = () => onClick(obstacle);

  const [_roofTexture, _wallTexture] = useLoader(TextureLoader, [
    boxRoof,
    boxWall,
  ]);

  const roofTexture = _roofTexture.clone();
  const wallTexture = _wallTexture.clone();

  roofTexture.wrapS = roofTexture.wrapT = RepeatWrapping;
  wallTexture.wrapS = wallTexture.wrapT = RepeatWrapping;

  roofTexture.repeat.set(Math.round(bzwSizeX), Math.round(bzwSizeY));
  roofTexture.needsUpdate = true;

  const xTexture = wallTexture.clone();
  const yTexture = wallTexture.clone();

  xTexture.repeat.set(bzwSizeX * XY_MULTIPLIER, bzwSizeZ * Z_MULTIPLIER);
  xTexture.needsUpdate = true;

  yTexture.repeat.set(bzwSizeY * XY_MULTIPLIER, bzwSizeZ * Z_MULTIPLIER);
  yTexture.needsUpdate = true;

  return (
    <SkinnableBox
      position={position}
      size={size}
      rotation={rotation}
      onClick={handleOnClick}
      isSelected={isSelected}
      topMaterial={roofTexture}
      botMaterial={roofTexture}
      xPosMaterial={xTexture}
      xNegMaterial={xTexture}
      yPosMaterial={yTexture}
      yNegMaterial={yTexture}
    />
  );
};

export default Box;
export type { Props as IBoxProps };
