import { useLoader } from '@react-three/fiber';
import React from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { deg2rad } from '../Utilities/math';

interface Props {
  position: [number, number, number];
  rotation: number;
}

const Tank = ({ position, rotation }: Props) => {
  const gltf = useLoader(GLTFLoader, '/assets/tank.glb');

  return (
    <mesh scale={[2, 2, 2]} rotation={[deg2rad(270), 0, rotation]}>
      <primitive object={gltf.scene} position={position} />
    </mesh>
  );
};

export default Tank;
