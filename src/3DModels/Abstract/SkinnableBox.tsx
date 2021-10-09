import { ThreeEvent } from '@react-three/fiber';
import React from 'react';
import { Texture } from 'three';

import { deg2rad } from '../../Utilities/math';
import { Vector3F } from '../../Utilities/types';
import { useHighlightableEdges } from '../../hooks/useHighlightableEdges';

interface Props {
  position: Vector3F;
  size: Vector3F;
  rotation: number;
  onClick: (e: MouseEvent) => void;
  isSelected?: boolean;
  isSelectable?: boolean;
  renderOrder?: number;
  renderTransparency?: boolean;
  topMaterial?: Texture | null;
  botMaterial?: Texture | null;
  xPosMaterial?: Texture | null;
  xNegMaterial?: Texture | null;
  yPosMaterial?: Texture | null;
  yNegMaterial?: Texture | null;
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
  renderOrder = 0,
  renderTransparency = false,
}: Props) => {
  const highlightableEdges = useHighlightableEdges();
  const isHighlighted =
    isSelectable && (highlightableEdges.isHovered || isSelected);

  const handleOnClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick(e);
  };

  const forceTransparency =
    yPosMaterial == null ||
    yNegMaterial == null ||
    topMaterial == null ||
    botMaterial == null ||
    xPosMaterial == null ||
    xNegMaterial == null ||
    false;
  const invisible = {
    color: 0xffffff,
    opacity: 0,
    transparent: true,
  };
  const standardProps = {
    attachArray: 'material',
    transparent: forceTransparency || renderTransparency,
  };

  const yPosMatProps = yPosMaterial != null ? { map: yPosMaterial } : invisible;
  const yNegMatProps = yNegMaterial != null ? { map: yNegMaterial } : invisible;
  const topMatProps = topMaterial != null ? { map: topMaterial } : invisible;
  const botMatProps = botMaterial != null ? { map: botMaterial } : invisible;
  const xPosMatProps = xPosMaterial != null ? { map: xPosMaterial } : invisible;
  const xNegMatProps = xNegMaterial != null ? { map: xNegMaterial } : invisible;

  return (
    <mesh
      ref={highlightableEdges.meshRef}
      {...highlightableEdges.meshProps}
      position={[bzwPosX, bzwPosZ + bzwSizeZ / 2, -bzwPosY]}
      rotation={[0, deg2rad(rotation), 0]}
      onClick={handleOnClick}
      renderOrder={renderOrder}
    >
      <boxBufferGeometry args={[bzwSizeX * 2, bzwSizeZ, bzwSizeY * 2]} />
      {/* === Materials === */}
      <meshBasicMaterial {...standardProps} {...yPosMatProps} /> {/* +y */}
      <meshBasicMaterial {...standardProps} {...yNegMatProps} /> {/* -y */}
      <meshBasicMaterial {...standardProps} {...topMatProps} /> {/* +z */}
      <meshBasicMaterial {...standardProps} {...botMatProps} /> {/* -z */}
      <meshBasicMaterial {...standardProps} {...xPosMatProps} /> {/* +x */}
      <meshBasicMaterial {...standardProps} {...xNegMatProps} /> {/* -x */}
      {/* === Edges Highlighting === */}
      {highlightableEdges.jsxHighlight({ isHighlighted })}
    </mesh>
  );
};

export default SkinnableBox;
