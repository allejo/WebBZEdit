import React from 'react';
import { useLoader } from 'react-three-fiber';
import { RepeatWrapping, TextureLoader } from 'three';

import { Vector3F } from '../Utilities/types';

import pyrWall from '../assets/pyrwall.png';
import { deg2rad } from '../Utilities/math';

interface Props {
  position: Vector3F;
  size: Vector3F;
  rotation?: number;
  zFlip?: boolean;
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
const Pyramid = ({
  position: [posX, posY, posZ],
  size: [sizeX, sizeY, sizeZ],
  rotation = 0,
  zFlip = false,
}: Props) => {
  const texture = useLoader(TextureLoader, pyrWall);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(sizeX, sizeY);

  return (
    <mesh
      position={[posX, (sizeZ / 2) + posZ, posY]}
      scale={[sizeX, 1, sizeY]}
      rotation={[0, 0, zFlip ? Math.PI : 0]}
    >
      <coneBufferGeometry
        attach='geometry'
        args={[
          /* radius */         PYRAMID_BASE_RADIUS,
          /* height */         sizeZ,
          /* radialSegments */ 4,
          /* heightSegments */ 1,
          /* openEnded */      false,
          /* thetaStart */     deg2rad(rotation + ROTATION_OFFSET),
        ]}
      />
      <meshBasicMaterial attach='material' map={texture} />
    </mesh>
  );
};

export default Pyramid;
export type { Props as IPyramidProps };

