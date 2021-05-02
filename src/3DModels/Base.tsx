import React from 'react';
import { useLoader } from 'react-three-fiber';
import { RepeatWrapping, Texture, TextureLoader } from 'three';

import SkinnableBox from '../Document/Obstacles/Abstract/SkinnableBox';
import { IBase } from '../Document/Obstacles/Base';

import blueBaseTop from '../assets/blue_basetop.png';
import blueBaseWall from '../assets/blue_basewall.png';
import greenBaseTop from '../assets/green_basetop.png';
import greenBaseWall from '../assets/green_basewall.png';
import purpleBaseTop from '../assets/purple_basetop.png';
import purpleBaseWall from '../assets/purple_basewall.png';
import redBaseTop from '../assets/red_basetop.png';
import redBaseWall from '../assets/red_basewall.png';

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
  const handleOnClick = () => onClick(obstacle);

  const [roofTexture, wallTexture] = useLoader<Texture[]>(
    TextureLoader,
    getTeamTextures(obstacle.color),
  );

  wallTexture.wrapS = wallTexture.wrapT = RepeatWrapping;

  const xTexture = wallTexture;
  const yTexture = wallTexture.clone();

  xTexture.repeat.set(size[1], size[2]);
  xTexture.needsUpdate = true;

  yTexture.repeat.set(size[0], size[2]);
  yTexture.needsUpdate = true;

  return (
    <SkinnableBox
      position={position}
      size={size}
      rotation={rotation}
      onClick={handleOnClick}
      topMaterial={roofTexture}
      botMaterial={roofTexture}
      xPosMaterial={xTexture}
      xNegMaterial={xTexture}
      yPosMaterial={yTexture}
      yNegMaterial={yTexture}
    />
  );
};

export default Base;
export type { Props as IBaseProps };
