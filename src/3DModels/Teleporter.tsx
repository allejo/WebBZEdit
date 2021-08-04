import { useLoader } from '@react-three/fiber';
import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  BoxBufferGeometry,
  EdgesGeometry,
  LineSegments,
  RepeatWrapping,
  TextureLoader,
} from 'three';

import { ITeleporter } from '../Document/Obstacles/Teleporter';
import { deg2rad } from '../Utilities/math';
import SkinnableBox from './Abstract/SkinnableBox';

import teleporterBorder from '../assets/teleporter_border.png';
import teleporterLink from '../assets/teleporter_link.png';

interface Props {
  obstacle: ITeleporter;
  isSelected: boolean;
  onClick: (obstacle: ITeleporter) => void;
}

const Teleporter = ({ obstacle, isSelected, onClick }: Props) => {
  const [hover, setHover] = useState(false);
  const { position, size, rotation = 0, border } = obstacle;
  const [bzwPosX, bzwPosY, bzwPosZ] = position;
  const [, bzwSizeY, bzwSizeZ] = size;

  const handleOnClick = (e: MouseEvent) => {
    e.stopPropagation();
    onClick(obstacle);
  };
  const handlePointerOver = (e: PointerEvent) => {
    e.stopPropagation();
    setHover(true);
  };
  const handlePointerOut = (e: PointerEvent) => {
    e.stopPropagation();
    setHover(false);
  };

  const segments = useRef<LineSegments>();

  useLayoutEffect(() => {
    if (!segments.current) {
      return;
    }

    const boxGeometry = new BoxBufferGeometry(
      border,
      bzwSizeZ + border,
      (bzwSizeY + border * 2) * 2,
    );
    boxGeometry.translate(0, bzwSizeZ / 2 + border / 2, 0);
    segments.current.geometry = new EdgesGeometry(boxGeometry);
  }, [border, bzwSizeY, bzwSizeZ, obstacle]);

  const isHighlighted = hover || isSelected;

  const [_borderTexture, _linkTexture] = useLoader(TextureLoader, [
    teleporterBorder,
    teleporterLink,
  ]);

  const borderTexture = _borderTexture.clone();
  const linkTexture = _linkTexture.clone();

  borderTexture.wrapS = borderTexture.wrapT = RepeatWrapping;
  linkTexture.wrapS = linkTexture.wrapT = RepeatWrapping;

  //
  // Link Texture
  //

  const worldUnitsSizeY = bzwSizeY + border;

  linkTexture.repeat.set(1, bzwSizeZ / (worldUnitsSizeY * 2) + border / 16);
  linkTexture.needsUpdate = true;

  //
  // Top Frame Textures
  //
  const topFrameFrontTexture = borderTexture.clone();
  topFrameFrontTexture.repeat.set(5, 0.5);
  topFrameFrontTexture.needsUpdate = true;

  const topFrameBackTexture = borderTexture.clone();
  topFrameBackTexture.repeat.set(5, 0.5);
  topFrameBackTexture.offset.set(0, 0.5);
  topFrameBackTexture.needsUpdate = true;

  const topFrameTopTexture = borderTexture.clone();
  topFrameTopTexture.repeat.set(0, 5);
  topFrameTopTexture.needsUpdate = true;

  const topFrameLeftTexture = borderTexture.clone();
  topFrameLeftTexture.repeat.set(0.5, 0.5);
  topFrameLeftTexture.offset.set(0, 1);
  topFrameLeftTexture.needsUpdate = true;

  const topFrameRightTexture = borderTexture.clone();
  topFrameRightTexture.repeat.set(0.5, 0.5);
  topFrameRightTexture.offset.set(0.5, 1);
  topFrameRightTexture.needsUpdate = true;

  //
  // Side Frame Textures
  //
  const sideFirstHalfTexture = borderTexture.clone();
  sideFirstHalfTexture.repeat.set(0.5, 9);
  sideFirstHalfTexture.needsUpdate = true;

  const sideSecondHalfTexture = borderTexture.clone();
  sideSecondHalfTexture.repeat.set(0.5, 9);
  sideSecondHalfTexture.offset.set(-0.5, 0);
  sideSecondHalfTexture.needsUpdate = true;

  const sideBottomTexture = borderTexture.clone();
  sideBottomTexture.repeat.set(1, 1);
  sideBottomTexture.needsUpdate = true;

  return (
    <mesh
      position={[bzwPosX, bzwPosZ, bzwPosY]}
      rotation={[0, -deg2rad(rotation), 0]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* === Link material === */}
      <SkinnableBox
        position={[0, 0, 0]}
        size={[0.05, worldUnitsSizeY, bzwSizeZ]}
        rotation={0}
        onClick={handleOnClick}
        isSelectable={false}
        topMaterial={linkTexture}
        botMaterial={linkTexture}
        xPosMaterial={linkTexture}
        xNegMaterial={linkTexture}
        yPosMaterial={linkTexture}
        yNegMaterial={linkTexture}
      />
      {/* === Frame === */}
      {border > 0 && (
        <>
          {/* === Top Bar === */}
          <SkinnableBox
            position={[0, 0, bzwSizeZ]}
            size={[border / 2, bzwSizeY + border * 2, border]}
            rotation={0}
            onClick={handleOnClick}
            isSelectable={false}
            topMaterial={topFrameTopTexture}
            botMaterial={topFrameTopTexture}
            xPosMaterial={topFrameRightTexture}
            xNegMaterial={topFrameLeftTexture}
            yPosMaterial={topFrameFrontTexture}
            yNegMaterial={topFrameBackTexture}
          />
          {/* === Left Bar === */}
          <SkinnableBox
            position={[0, bzwSizeY + border * 1.5, 0]}
            size={[border / 2, border / 2, bzwSizeZ]}
            rotation={0}
            onClick={handleOnClick}
            isSelectable={false}
            topMaterial={sideBottomTexture}
            botMaterial={sideBottomTexture}
            xPosMaterial={sideFirstHalfTexture}
            xNegMaterial={sideFirstHalfTexture}
            yPosMaterial={sideSecondHalfTexture}
            yNegMaterial={sideSecondHalfTexture}
          />
          {/* === Right Bar === */}
          <SkinnableBox
            position={[0, -(bzwSizeY + border * 1.5), 0]}
            size={[border / 2, border / 2, bzwSizeZ]}
            rotation={0}
            onClick={handleOnClick}
            isSelectable={false}
            topMaterial={sideBottomTexture}
            botMaterial={sideBottomTexture}
            xPosMaterial={sideSecondHalfTexture}
            xNegMaterial={sideSecondHalfTexture}
            yPosMaterial={sideFirstHalfTexture}
            yNegMaterial={sideFirstHalfTexture}
          />
        </>
      )}
      {/* === Edges Highlighting === */}
      <lineSegments ref={segments}>
        <lineBasicMaterial
          attach="material"
          color={0x00ffff}
          transparent={!isHighlighted}
          opacity={isHighlighted ? 1 : 0}
        />
      </lineSegments>
    </mesh>
  );
};

export default Teleporter;
