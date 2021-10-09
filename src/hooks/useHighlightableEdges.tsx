import { Color, ThreeEvent } from '@react-three/fiber';
import React, {
  MutableRefObject,
  ReactNode,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { EdgesGeometry, LineSegments, Mesh } from 'three';

export interface IHighlightableEdges {
  isHovered: boolean;
  jsxHighlight: (config: {
    color?: Color;
    isHighlighted?: boolean;
  }) => ReactNode;
  meshProps: {
    onPointerOver: (e: ThreeEvent<PointerEvent>) => void;
    onPointerOut: (e: ThreeEvent<PointerEvent>) => void;
  };
  meshRef: MutableRefObject<Mesh | undefined>;
  segmentsRef: MutableRefObject<LineSegments | undefined>;
}

export function useHighlightableEdges(): IHighlightableEdges {
  const segmentsRef = useRef<LineSegments>();
  const meshRef = useRef<Mesh>();

  const [isHovered, setIsHovered] = useState(false);

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setIsHovered(true);
  };
  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setIsHovered(false);
  };

  useLayoutEffect(() => {
    if (!meshRef.current || !segmentsRef.current) {
      return;
    }

    segmentsRef.current.geometry = new EdgesGeometry(meshRef.current.geometry);
  }, [meshRef.current?.geometry]);

  return {
    isHovered,
    jsxHighlight: ({ color = 0x00ffff, isHighlighted = false }) => (
      <lineSegments ref={segmentsRef}>
        <lineBasicMaterial
          color={color}
          transparent={!isHighlighted}
          opacity={isHighlighted ? 1 : 0}
        />
      </lineSegments>
    ),
    meshProps: {
      onPointerOver: handlePointerOver,
      onPointerOut: handlePointerOut,
    },
    meshRef,
    segmentsRef,
  };
}
