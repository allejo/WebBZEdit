import { extend, useThree, useFrame, Object3DNode } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import eventBus from '../../../EventBus';
import {
  CameraPositionResetEvent,
  ICameraPositionResetEvent,
} from '../../../Events/ICameraPositionResetEvent';

// https://spectrum.chat/@react-three/fiber/general/property-orbitcontrols-does-not-exist-on-type-jsx-intrinsicelements~44712e68-4601-4486-b4b4-5e112f3dc09e
declare global {
  namespace JSX {
    interface IntrinsicElements {
      orbitControls: Object3DNode<OrbitControls, typeof OrbitControls>;
    }
  }
}

extend({ OrbitControls });

const CameraControls: React.FC<any> = (props) => {
  const cameraResetListener = useRef<string>('');

  const orbitRef = useRef<OrbitControls>(null);
  const { camera, gl } = useThree();

  useEffect(() => {
    cameraResetListener.current = eventBus.on<ICameraPositionResetEvent>(
      CameraPositionResetEvent,
      () => {
        camera.position.set(...CAMERA_DEFAULT_POS);

        orbitRef.current?.target.set(0, 0, 0);
        orbitRef.current?.update();
      },
    );

    return () => {
      eventBus.remove(CameraPositionResetEvent, cameraResetListener.current);
    };
  }, [camera]);

  useFrame(() => {
    orbitRef.current?.update();
  });

  return (
    <orbitControls ref={orbitRef} args={[camera, gl.domElement]} {...props} />
  );
};

export const CAMERA_DEFAULT_POS: [number, number, number] = [-15, 15, 15];
export default CameraControls;

Object.freeze(CAMERA_DEFAULT_POS);
