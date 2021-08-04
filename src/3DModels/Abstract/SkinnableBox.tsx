import React, { useRef, useState, MouseEvent, PointerEvent } from 'react';
import { useUpdate } from 'react-three-fiber';
import { EdgesGeometry, LineSegments, Mesh, Texture } from 'three';

import { deg2rad } from '../../Utilities/math';
import { Vector3F } from '../../Utilities/types';

interface Props {
  position: Vector3F;
  size: Vector3F;
  rotation: number;
  onClick: (e: React.MouseEvent) => void;
  isSelected?: boolean;
  isSelectable?: boolean;
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
  isSelected = false,
  isSelectable = true,
}: Props) => {
  const [hover, setHover] = useState(false);
  const mesh = useRef<Mesh>();
  const segments = useUpdate<LineSegments>(
    (s) => {
      if (!mesh.current) {
        return;
      }

      s.geometry = new EdgesGeometry(mesh.current.geometry);
    },
    [mesh.current?.geometry],
  );
  const isHighlighted = isSelectable && (hover || isSelected);

  const handleOnClick = (e: MouseEvent) => {
    e.stopPropagation();
    onClick(e);
  };
  const handlePointerOver = (e: PointerEvent) => {
    e.stopPropagation();
    setHover(true);
  };
  const handlePointerOut = (e: PointerEvent) => {
    e.stopPropagation();
    setHover(false);
  };

  return (
    <mesh
      ref={mesh}
      position={[bzwPosX, bzwPosZ + bzwSizeZ / 2, -bzwPosY]}
      rotation={[0, deg2rad(rotation), 0]}
      onClick={handleOnClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <boxBufferGeometry args={[bzwSizeX * 2, bzwSizeZ, bzwSizeY * 2]} />
      {/* === Materials === */}
      <meshBasicMaterial attachArray="material" map={yPosMaterial} /> {/* +y */}
      <meshBasicMaterial attachArray="material" map={yNegMaterial} /> {/* -y */}
      <meshBasicMaterial attachArray="material" map={topMaterial} /> {/* +z */}
      <meshBasicMaterial attachArray="material" map={botMaterial} /> {/* -z */}
      <meshBasicMaterial attachArray="material" map={xPosMaterial} /> {/* +x */}
      <meshBasicMaterial attachArray="material" map={xNegMaterial} /> {/* -x */}
      {/* === Edges Highlighting === */}
      <lineSegments ref={segments}>
        <lineBasicMaterial
          color={0x00ffff}
          transparent={!isHighlighted}
          opacity={isHighlighted ? 1 : 0}
        />
      </lineSegments>
    </mesh>
  );
};

export default SkinnableBox;
