import { Canvas } from '@react-three/fiber';
import React, { Suspense } from 'react';
import { useRecoilBridgeAcrossReactRoots_UNSTABLE } from 'recoil';

import BZWDocumentRenderer from './Renderer/BZWDocumentRenderer';
import OrbitalControls from './Renderer/OrbitalControls';

const RendererPanel = () => {
  const RecoilBridge = useRecoilBridgeAcrossReactRoots_UNSTABLE();

  return (
    <Canvas>
      <RecoilBridge>
        <Suspense fallback={null}>
          <BZWDocumentRenderer />
        </Suspense>
      </RecoilBridge>

      <hemisphereLight args={[0xffffbb, 0x080820, 0.8]} />
      <gridHelper args={[800, 40]} />
      <axesHelper args={[200]} />
      <OrbitalControls />
    </Canvas>
  );
};

export default RendererPanel;
