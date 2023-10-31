import { extend, Object3DNode, useFrame, useThree } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import {
	CameraPositionResetEvent,
	ICameraPositionResetEvent,
} from '../../../Events/ICameraPositionResetEvent';
import { usePageStatus } from '../../../hooks/usePageStatus';
import eventBus from '../../../Utilities/EventBus';

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
	const pageStatus = usePageStatus();
	const cameraResetListener = useRef<string>('');

	const orbitRef = useRef<OrbitControls>(null);
	const { camera, gl } = useThree();

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
			enabled={!(pageStatus.isSomethingFocused || pageStatus.isModalOpen)}
			args={[camera, gl.domElement]}
			// Keyboard movement settings
			enableDamping={true}
			dampingFactor={0.05}
			keyPanSpeed={40}
			screenSpacePanning={pageStatus.isHoldingShift}
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
