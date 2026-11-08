import { Canvas, useThree } from '@react-three/fiber';
import React, { Suspense, useLayoutEffect, useRef, useState } from 'react';
import { Box3, OrthographicCamera, Vector3 } from 'three';

import Base from '../3DModels/Base';
import Box from '../3DModels/Box';
import Cone from '../3DModels/Cone';
import Pyramid from '../3DModels/Pyramid';
import Teleporter from '../3DModels/Teleporter';
import Zone from '../3DModels/Zone';
import { newIBase } from '../Document/Obstacles/Base';
import { newIBox } from '../Document/Obstacles/Box';
import { newICone } from '../Document/Obstacles/Cone';
import { newIPyramid } from '../Document/Obstacles/Pyramid';
import { newITeleporter } from '../Document/Obstacles/Teleporter';
import { newIZone } from '../Document/Obstacles/Zone';

const SIZE = 256;
const noop = () => {};
const common = { isSelected: false, onClick: noop };

// Output filename (without extension) => model to render
const THUMBNAILS: Record<string, JSX.Element> = {
  thumb_box: <Box {...common} obstacle={newIBox()} />,
  thumb_cone: <Cone {...common} obstacle={newICone()} />,
  thumb_pyramid: <Pyramid {...common} obstacle={newIPyramid()} />,
  thumb_zone: <Zone {...common} obstacle={newIZone()} />,
  thumb_teleporter: <Teleporter {...common} obstacle={newITeleporter()} />,
  thumb_base_red: <Base {...common} obstacle={{ ...newIBase(), color: 1 }} />,
  thumb_base_green: <Base {...common} obstacle={{ ...newIBase(), color: 2 }} />,
  thumb_base_blue: <Base {...common} obstacle={{ ...newIBase(), color: 3 }} />,
  thumb_base_purple: (
    <Base {...common} obstacle={{ ...newIBase(), color: 4 }} />
  ),
};

/**
 * Frames the model with an isometric view, then flags the canvas as ready.
 */
const FitAndReady = ({
  children,
  onReady,
}: {
  children: React.ReactNode;
  onReady: () => void;
}) => {
  const group = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useLayoutEffect(() => {
    const cam = camera as OrthographicCamera;
    const box = new Box3().setFromObject(group.current!);
    const center = box.getCenter(new Vector3());
    const radius = box.getSize(new Vector3()).length() / 2;

    cam.position
      .copy(center)
      .add(new Vector3(1, 0.8, 1).normalize().multiplyScalar(radius * 4));
    cam.zoom = (SIZE * 0.9) / (radius * 2);
    cam.near = 0.1;
    cam.far = radius * 20;
    cam.lookAt(center);
    cam.updateProjectionMatrix();

    const t = setTimeout(onReady, 300); // let a few frames render
    return () => clearTimeout(t);
  }, [camera, onReady]);

  return <group ref={group}>{children}</group>;
};

const Thumbnail = ({ name, model }: { name: string; model: JSX.Element }) => {
  const [ready, setReady] = useState(false);

  return (
    <div
      data-thumbnail={name}
      data-ready={ready}
      style={{ width: SIZE, height: SIZE }}
    >
      <Canvas
        orthographic
        gl={{ preserveDrawingBuffer: true, alpha: true }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <Suspense fallback={null}>
          <FitAndReady onReady={() => setReady(true)}>{model}</FitAndReady>
        </Suspense>
      </Canvas>
    </div>
  );
};

const ThumbnailSheet = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
    {Object.entries(THUMBNAILS).map(([name, model]) => (
      <Thumbnail key={name} name={name} model={model} />
    ))}
  </div>
);

export default ThumbnailSheet;
