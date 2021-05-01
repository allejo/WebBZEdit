import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from 'react-three-fiber';

import OrbitalControls from './Components/CameraControls/OrbitalControls';

import hix from './assets/hix.bzw';

import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { BZWDocument } from './Document/BZWDocument';
import BZWDocumentRenderer from './Components/BZWDocumentRenderer';

const App: React.FC = () => {
  const [document, setDocument] = useState<BZWDocument | null>(null);

  useEffect(() => {
    fetch(hix)
      .then((res) => res.text())
      .then((body) => {
        const document = new BZWDocument(body);
        setDocument(document);
        console.log('roar');
      });
  }, []);

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

export default App;
