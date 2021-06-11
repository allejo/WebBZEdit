import React from 'react';
import { useLoader } from 'react-three-fiber';
import { RepeatWrapping, Texture, TextureLoader } from 'three';

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
  const { position, size, rotation = 0, border } = obstacle;
  const [bzwPosX, bzwPosY, bzwPosZ] = position;
  const [, bzwSizeY, bzwSizeZ] = size;
  const handleOnClick = () => onClick(obstacle);

  const [borderTexture, linkTexture] = useLoader<Texture[]>(TextureLoader, [
    teleporterBorder,
    teleporterLink,
  ]);

  borderTexture.wrapS = borderTexture.wrapT = RepeatWrapping;
  linkTexture.wrapS = linkTexture.wrapT = RepeatWrapping;

  // @TODO: Fix texturing of the frame
  // @TODO: Add custom geometry of `isSelected`

  return (
    <mesh
      position={[bzwPosX, bzwPosZ, bzwPosY]}
      rotation={[0, -deg2rad(rotation), 0]}
    >
      {/* === Top Frame === */}
      <SkinnableBox
        position={[0, 0, bzwSizeZ]}
        size={[border / 2, bzwSizeY + border * 2, border]}
        rotation={0}
        onClick={handleOnClick}
        isSelected={false}
        isSelectable={false}
        topMaterial={borderTexture}
        botMaterial={borderTexture}
        xPosMaterial={borderTexture}
        xNegMaterial={borderTexture}
        yPosMaterial={borderTexture}
        yNegMaterial={borderTexture}
      />
      {/* === Left Frame === */}
      <SkinnableBox
        position={[0, bzwSizeY + border * 1.5, 0]}
        size={[border / 2, border / 2, bzwSizeZ]}
        rotation={0}
        onClick={handleOnClick}
        isSelected={false}
        isSelectable={false}
        topMaterial={borderTexture}
        botMaterial={borderTexture}
        xPosMaterial={borderTexture}
        xNegMaterial={borderTexture}
        yPosMaterial={borderTexture}
        yNegMaterial={borderTexture}
      />
      {/* === Right Frame === */}
      <SkinnableBox
        position={[0, -(bzwSizeY + border * 1.5), 0]}
        size={[border / 2, border / 2, bzwSizeZ]}
        rotation={0}
        onClick={handleOnClick}
        isSelected={false}
        isSelectable={false}
        topMaterial={borderTexture}
        botMaterial={borderTexture}
        xPosMaterial={borderTexture}
        xNegMaterial={borderTexture}
        yPosMaterial={borderTexture}
        yNegMaterial={borderTexture}
      />
      {/* === Link material === */}
      <SkinnableBox
        position={[0, 0, 0]}
        size={[0.1, bzwSizeY + border, bzwSizeZ]}
        rotation={0}
        onClick={handleOnClick}
        isSelected={false}
        isSelectable={false}
        topMaterial={linkTexture}
        botMaterial={linkTexture}
        xPosMaterial={linkTexture}
        xNegMaterial={linkTexture}
        yPosMaterial={linkTexture}
        yNegMaterial={linkTexture}
      />
    </mesh>
  );
};

export default Teleporter;
