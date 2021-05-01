import React from 'react';
import { useLoader } from 'react-three-fiber';
import { RepeatWrapping, TextureLoader } from 'three';

import pyrWall from '../assets/pyrwall.png';
import { deg2rad } from '../Utilities/math';
import { IPyramid } from '../Document/Obstacles/Pyramid';

interface Props {
  obstacle: IPyramid;
  onClick: (obstacle: IPyramid) => void;
}

// The "radius" of this pyramid is from the base's center to one of the four
// vertices of the base. The base is made up of four right isosceles triangles
// where the third edge is 1 unit. Using the Pythagorean theorem, we get:
//
//   a^2 + b^2 = c^2
//     2 * a^2 = c^2
// sqrt(2) * a = c
//           a = c / sqrt(2)
const PYRAMID_BASE_RADIUS = 1 / Math.sqrt(2);

// The right-hand side of the x-axis is designated as the 0˚ mark. The first
// vertex of a pyramid will start on the x-axis meaning the pyramid is visually
// rotated 45 degrees.
const ROTATION_OFFSET = 45;

/**
 * @constructor
 * @see https://threejs.org/docs/#api/en/geometries/ConeGeometry
 */
const Pyramid = ({ obstacle, onClick }: Props) => {
  const {
    position: [posX, posY, posZ],
    size: [sizeX, sizeY, sizeZ],
    rotation = 0,
    flipz = false,
  } = obstacle;
  const handleOnClick = () => onClick(obstacle);

  const texture = useLoader(TextureLoader, pyrWall);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(sizeX, sizeY);

  return (
    <mesh
      position={[posX, (Math.abs(sizeZ) / 2) + posZ, posY]}
      scale={[sizeX * 2, 1, sizeY * 2]}
      rotation={[0, deg2rad(rotation), flipz ? Math.PI : 0]}
      onClick={handleOnClick}
    >
      <coneBufferGeometry
        attach="geometry"
        args={[
          /* radius */ PYRAMID_BASE_RADIUS,
          /* height */ sizeZ,
          /* radialSegments */ 4,
          /* heightSegments */ 1,
          /* openEnded */ false,
          /* thetaStart */ deg2rad(ROTATION_OFFSET),
        ]}
      />
      <meshBasicMaterial attach="material" map={texture} />
    </mesh>
  );
};

export default Pyramid;
export type { Props as IPyramidProps };
