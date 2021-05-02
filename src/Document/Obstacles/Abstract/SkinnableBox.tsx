import React from 'react';
import { Texture } from 'three';

import { Vector3F } from '../../../Utilities/types';
import { deg2rad } from '../../../Utilities/math';

interface Props {
  position: Vector3F;
  size: Vector3F;
  rotation: number;
  onClick: (e: React.MouseEvent) => void;
  topMaterial: Texture;
  botMaterial: Texture;
  xPosMaterial: Texture;
  xNegMaterial: Texture;
  yPosMaterial: Texture;
  yNegMaterial: Texture;
}

const SkinnableBox = ({
  position: [bzwPosX, bzwPosY, bzwPosZ],
  size: [bzwSizeX, bzwSizeY, bzwSizeZ],
  rotation,
  onClick,
  topMaterial,
  botMaterial,
  xPosMaterial,
  xNegMaterial,
  yPosMaterial,
  yNegMaterial,
}: Props) => (
  <mesh
    position={[bzwPosX, bzwPosZ + bzwSizeZ / 2, bzwPosY]}
    rotation={[0, -deg2rad(rotation), 0]}
    onClick={onClick}
  >
    <boxBufferGeometry
      attach="geometry"
      args={[bzwSizeX * 2, bzwSizeZ, bzwSizeY * 2]}
    />
    <meshBasicMaterial attachArray="material" map={xPosMaterial} /> {/* +z */}
    <meshBasicMaterial attachArray="material" map={xNegMaterial} /> {/* -z */}
    <meshBasicMaterial attachArray="material" map={topMaterial} /> {/* +y */}
    <meshBasicMaterial attachArray="material" map={botMaterial} /> {/* -y */}
    <meshBasicMaterial attachArray="material" map={yPosMaterial} /> {/* +x */}
    <meshBasicMaterial attachArray="material" map={yNegMaterial} /> {/* -x */}
  </mesh>
);

export default SkinnableBox;
