import React from 'react';
import { useLoader } from 'react-three-fiber';
import { RepeatWrapping, TextureLoader } from 'three';

import { deg2rad } from '../Utilities/math';
import { IBox } from '../Document/Obstacles/Box';

import boxRoof from '../assets/roof.png';
import boxWall from '../assets/boxwall.png';

interface Props {
  obstacle: IBox;
}

/**
 * @constructor
 * @see https://threejs.org/docs/#api/en/geometries/BoxGeometry
 */
const Box = ({
  obstacle: {
    position: [posX, posY, posZ],
    size: [sizeX, sizeY, sizeZ],
    rotation = 0,
  },
}: Props) => {
  const roofTexture = useLoader(TextureLoader, boxRoof);
  const wallTexture = useLoader(TextureLoader, boxWall);

  roofTexture.wrapS = roofTexture.wrapT = RepeatWrapping;
  wallTexture.wrapS = wallTexture.wrapT = RepeatWrapping;

  roofTexture.repeat.set(sizeX, sizeY);

  const xTexture = wallTexture;
  const yTexture = wallTexture.clone();

  xTexture.repeat.set(sizeZ, sizeY);
  xTexture.needsUpdate = true;

  yTexture.repeat.set(sizeX, sizeY);
  yTexture.needsUpdate = true;

  return (
    <mesh
      position={[posX, (sizeZ / 2) + posZ, posY]}
      rotation={[0, deg2rad(rotation), 0]}
    >
      <boxBufferGeometry attach="geometry" args={[sizeX, sizeY, sizeZ]} />

      <meshBasicMaterial attachArray="material" map={xTexture} />    {/* +z */}
      <meshBasicMaterial attachArray="material" map={xTexture} />    {/* -z */}

      <meshBasicMaterial attachArray="material" map={roofTexture} /> {/* +y */}
      <meshBasicMaterial attachArray="material" map={roofTexture} /> {/* -y */}

      <meshBasicMaterial attachArray="material" map={yTexture} />    {/* +x */}
      <meshBasicMaterial attachArray="material" map={yTexture} />    {/* -x */}
    </mesh>
  );
};

export default Box;
