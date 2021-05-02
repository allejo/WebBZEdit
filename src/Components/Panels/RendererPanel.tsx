import React, { Suspense } from 'react';
import { Canvas } from 'react-three-fiber';
import { useRecoilValue } from 'recoil';

import BZWDocumentRenderer from '../BZWDocumentRenderer';
import OrbitalControls from '../CameraControls/OrbitalControls';

import { documentState } from '../../atoms';

const RendererPanel = () => {
  const document = useRecoilValue(documentState);

  return (
    <Canvas>
      <Suspense fallback={null}>
        {document && <BZWDocumentRenderer document={document} />}
      </Suspense>

      <OrbitalControls />
      <gridHelper args={[800, 40]} />
      <axesHelper args={[200]} />
    </Canvas>
  );
};

export default RendererPanel;
