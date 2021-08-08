import { ThreeEvent, useLoader } from '@react-three/fiber';
import React, { useEffect, useRef, useState } from 'react';
import { BoxGeometry, EdgesGeometry, LineSegments } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { ITankModel } from '../Document/Obstacles/TankModel';
import { deg2rad } from '../Utilities/math';

interface Props {
  configuration: ITankModel;
  isSelected: boolean;
  onClick: (configuration: ITankModel) => void;
}

const Tank = ({ configuration, isSelected, onClick }: Props) => {
  const { position, rotation = 0 } = configuration;
  const [hover, setHover] = useState(false);
  const segments = useRef<LineSegments>();
  // Approximate bounding box for the tank model (with magic numbers)
  const bbox = useRef(new EdgesGeometry(new BoxGeometry(8, 3, 2.25)));
  const gltf = useLoader(GLTFLoader, '/assets/tank.glb');

  const isHighlighted = isSelected || hover;

  const handleOnClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick(configuration);
  };
  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHover(true);
  };
  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHover(false);
  };

  useEffect(() => {
    gltf.scene.traverse(function (object: any) {
      if (!object.isMesh) {
        return;
      }

      object.material.color.set(isHighlighted ? 0x393939 : 0xffffff);
    });
  }, [gltf, isHighlighted]);

  return (
    <mesh
      scale={[2, 2, 2]}
      rotation={[deg2rad(270), 0, deg2rad(rotation)]}
      position={position}
      onClick={handleOnClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <primitive object={gltf.scene} />
      {/* === BBox Highlight === */}
      <lineSegments
        ref={segments}
        geometry={bbox.current}
        // more magic numbers since our tank isn't perfectly centered
        position={[0.9, 0, 1.125]}
      >
        <lineBasicMaterial
          color={0x00ffff}
          transparent={!isHighlighted}
          opacity={isHighlighted ? 1 : 0}
        />
      </lineSegments>
    </mesh>
  );
};

export default Tank;
export type { Props as ITankProps };
