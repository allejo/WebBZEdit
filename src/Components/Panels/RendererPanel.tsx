import React, { Suspense } from 'react';
import { Canvas } from 'react-three-fiber';
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

      <OrbitalControls />
      <gridHelper args={[800, 40]} />
      <axesHelper args={[200]} />
    </Canvas>
  );
};

export default RendererPanel;
