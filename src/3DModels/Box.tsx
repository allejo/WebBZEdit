import React from 'react';
import { useLoader } from 'react-three-fiber';
import { RepeatWrapping, TextureLoader } from 'three';

import { deg2rad } from '../Utilities/math';
import { IBox } from '../Document/Obstacles/Box';

import boxRoof from '../assets/roof.png';
import boxWall from '../assets/boxwall.png';

interface Props {
  obstacle: IBox;
  onClick: (obstacle: IBox) => void;
}

/**
 * @constructor
 * @see https://threejs.org/docs/#api/en/geometries/BoxGeometry
 */
const Box = ({ obstacle, onClick }: Props) => {
  const {
    position: [bzwPosX, bzwPosY, bzwPosZ],
    size: [bzwSizeX, bzwSizeY, bzwSizeZ],
    rotation = 0,
  } = obstacle;
  const handleOnClick = () => onClick(obstacle);

  const roofTexture = useLoader(TextureLoader, boxRoof);
  const wallTexture = useLoader(TextureLoader, boxWall);

  roofTexture.wrapS = roofTexture.wrapT = RepeatWrapping;
  wallTexture.wrapS = wallTexture.wrapT = RepeatWrapping;

  roofTexture.repeat.set(bzwSizeX / 2, bzwSizeY / 2);

  const xTexture = wallTexture;
  const yTexture = wallTexture.clone();

  xTexture.repeat.set(bzwSizeZ, bzwSizeY);
  xTexture.needsUpdate = true;

  yTexture.repeat.set(bzwSizeX, bzwSizeY);
  yTexture.needsUpdate = true;

  return (
    <mesh
      position={[bzwPosX, bzwPosZ + bzwSizeZ / 2, bzwPosY]}
      rotation={[0, -deg2rad(rotation), 0]}
      onClick={handleOnClick}
    >
      <boxBufferGeometry
        attach="geometry"
        args={[bzwSizeX * 2, bzwSizeZ, bzwSizeY * 2]}
      />
      <meshBasicMaterial attachArray="material" map={xTexture} /> {/* +z */}
      <meshBasicMaterial attachArray="material" map={xTexture} /> {/* -z */}
      <meshBasicMaterial attachArray="material" map={roofTexture} /> {/* +y */}
      <meshBasicMaterial attachArray="material" map={roofTexture} /> {/* -y */}
      <meshBasicMaterial attachArray="material" map={yTexture} /> {/* +x */}
      <meshBasicMaterial attachArray="material" map={yTexture} /> {/* -x */}
    </mesh>
  );
};

export default Box;
export type { Props as IBoxProps };
