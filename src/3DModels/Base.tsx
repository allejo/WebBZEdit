import React from 'react';

import { IBase } from '../Document/Obstacles/Base';
import SkinnableBox from '../Document/Obstacles/Abstract/SkinnableBox';

import blueBaseTop from '../assets/blue_basetop.png';
import blueBaseWall from '../assets/blue_basewall.png';
import greenBaseTop from '../assets/green_basetop.png';
import greenBaseWall from '../assets/green_basewall.png';
import purpleBaseTop from '../assets/purple_basetop.png';
import purpleBaseWall from '../assets/purple_basewall.png';
import redBaseTop from '../assets/red_basetop.png';
import redBaseWall from '../assets/red_basewall.png';
import { useLoader } from 'react-three-fiber';
import { RepeatWrapping, Texture, TextureLoader } from 'three';

interface Props {
  obstacle: IBase;
  onClick: (obstacle: IBase) => void;
}

function getTeamTextures(team: IBase['color']): string[] {
  if (team === 1) {
    return [redBaseTop, redBaseWall];
  } else if (team === 2) {
    return [greenBaseTop, greenBaseWall];
  } else if (team === 3) {
    return [blueBaseTop, blueBaseWall];
  }

  return [purpleBaseTop, purpleBaseWall];
}

const Base = ({ obstacle, onClick }: Props) => {
  const { position, size, rotation = 0 } = obstacle;
  const [bzwSizeX, bzwSizeY, bzwSizeZ] = size;
  const handleOnClick = () => onClick(obstacle);

  const [roofTexture, wallTexture] = useLoader<Texture[]>(
    TextureLoader,
    getTeamTextures(obstacle.color),
  );

  wallTexture.wrapS = wallTexture.wrapT = RepeatWrapping;

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

export default Base;
export type { Props as IBaseProps };
