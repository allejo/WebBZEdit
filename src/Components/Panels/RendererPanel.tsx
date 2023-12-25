import { Canvas } from '@react-three/fiber';
import React, { Suspense } from 'react';
import { useRecoilBridgeAcrossReactRoots_UNSTABLE } from 'recoil';

import { CAMERA_DEFAULT_POS } from '../../Utilities/contracts';
import BZWDocumentRenderer from './Renderer/BZWDocumentRenderer';
import CameraControls from './Renderer/CameraControls';

const RendererPanel = () => {
	const RecoilBridge = useRecoilBridgeAcrossReactRoots_UNSTABLE();

	return (
		<Canvas camera={{ position: CAMERA_DEFAULT_POS }}>
			<RecoilBridge>
				<Suspense fallback={null}>
					<BZWDocumentRenderer />
				</Suspense>
			</RecoilBridge>

			<hemisphereLight args={[0xffffbb, 0x080820, 0.8]} />
			<gridHelper args={[800, 40]} />
			<axesHelper args={[200]} />
			<CameraControls />
		</Canvas>
	);
};

export default RendererPanel;
