import { extend, useThree, useFrame, Object3DNode } from '@react-three/fiber';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import eventBus from '../../../EventBus';
import {
  CameraPositionResetEvent,
  ICameraPositionResetEvent,
} from '../../../Events/ICameraPositionResetEvent';
import keyboard from '../../../Utilities/keyboard';

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
  const [isHoldingShift, setIsHoldingShift] = useState(false);

  const orbitRef = useRef<OrbitControls>(null);
  const { camera, gl } = useThree();

  const shiftDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isHoldingShift) {
        setIsHoldingShift(e.key === keyboard.SHIFT);
      }
    },
    [isHoldingShift, setIsHoldingShift],
  );
  const shiftUp = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === keyboard.SHIFT) {
        setIsHoldingShift(false);
      }
    },
    [setIsHoldingShift],
  );

  // Listen for when shift is held down
  useEffect(() => {
    document.addEventListener('keydown', shiftDown);
    document.addEventListener('keyup', shiftUp);

    return () => {
      document.removeEventListener('keydown', shiftDown);
      document.removeEventListener('keyup', shiftUp);
    };
  }, [shiftDown, shiftUp]);

  useEffect(() => {
    // @ts-ignore
    orbitRef.current?.listenToKeyEvents(window);
  }, [orbitRef]);

  useEffect(() => {
    cameraResetListener.current = eventBus.on<ICameraPositionResetEvent>(
      CameraPositionResetEvent,
      () => {
        orbitRef.current?.reset();
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
    <orbitControls
      ref={orbitRef}
      args={[camera, gl.domElement]}
      // Keyboard movement settings
      enableDamping={true}
      dampingFactor={0.05}
      keyPanSpeed={40}
      screenSpacePanning={isHoldingShift}
      // Camera/Zoom settings
      minDistance={20}
      maxDistance={250}
      maxPolarAngle={Math.PI / 2}
      {...props}
    />
  );
};

export const CAMERA_DEFAULT_POS: [number, number, number] = [-15, 15, 15];
export default CameraControls;

Object.freeze(CAMERA_DEFAULT_POS);
