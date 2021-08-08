import { ThreeEvent, useLoader } from '@react-three/fiber';
import React from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { ITankModel } from '../Document/Obstacles/TankModel';
import { deg2rad } from '../Utilities/math';

interface Props {
  configuration: ITankModel;
  isSelected: boolean;
  onClick: (configuration: ITankModel) => void;
}

const Tank = ({ configuration, onClick }: Props) => {
  const { position, rotation = 0 } = configuration;
  const gltf = useLoader(GLTFLoader, '/assets/tank.glb');
  const handleOnClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onClick(configuration);
  };

  return (
    <mesh
      scale={[2, 2, 2]}
      rotation={[deg2rad(270), 0, deg2rad(rotation)]}
      position={position}
      onClick={handleOnClick}
    >
      <primitive object={gltf.scene} />
    </mesh>
  );
};

export default Tank;
export type { Props as ITankProps };
