import { ThreeEvent, useLoader } from '@react-three/fiber';
import React, { useEffect, useMemo } from 'react';
import { RepeatWrapping, TextureLoader } from 'three';

import { ICone } from '../Document/Obstacles/Cone';
import { useHighlightableEdges } from '../hooks/useHighlightableEdges';
import { buildConeGeometry } from './Abstract/ConeGeometryFactory';

import boxWall from '../assets/boxwall.png';
import roof from '../assets/roof.png';
import wall from '../assets/wall.png';

interface Props {
  obstacle: ICone;
  isSelected: boolean;
  onClick: (obstacle: ICone) => void;
}

/**
 * NOTE: BZFlag's ConeObstacle doesn't respect the `rotation` property during
 * rendering, so it is purposely ignored here to match the game's behavior.
 *
 * @see ConeObstacle::makeMesh() (bzflag/src/obstacle/ConeObstacle.cxx)
 */
const Cone = ({ obstacle, isSelected, onClick }: Props) => {
  const highlightableEdges = useHighlightableEdges();
  const {
    position: [posX, posY, posZ],
    size,
    // rotation = 0,
    angle = 360,
    divisions,
    texsize = [-8, -8],
  } = obstacle;
  const isHighlighted = highlightableEdges.isHovered || isSelected;

  // Same order as the geometry groups: edge, bottom, startside, endside.
  // UVs already contain the tiling, so only wrapping is needed (repeat stays 1)
  const textures = useLoader(TextureLoader, [boxWall, roof, wall, wall]);
  textures.forEach((t) => (t.wrapS = t.wrapT = RepeatWrapping));

  const geometry = useMemo(
    () => buildConeGeometry(size, angle, divisions, texsize),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...size, angle, divisions, ...texsize],
  );
  useEffect(() => () => geometry?.dispose(), [geometry]);

  // BZFlag refuses to build this cone, so draw nothing as well
  if (geometry == null) {
    return null;
  }

  const handleOnClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick(obstacle);
  };

  return (
    <mesh
      ref={highlightableEdges.meshRef}
      {...highlightableEdges.meshProps}
      geometry={geometry}
      position={[posX, posZ, -posY]}
      // BZFlag doesn't respect the `rotation` property for Cones.
      // rotation={[0, deg2rad(rotation), 0]}
      onClick={handleOnClick}
    >
      {textures.map((t, i) => (
        <meshBasicMaterial key={i} attachArray="material" map={t} />
      ))}
      {highlightableEdges.jsxHighlight({ isHighlighted })}
    </mesh>
  );
};

export default Cone;
export type { Props as IConeProps };
