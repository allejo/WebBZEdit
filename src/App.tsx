import React, { Suspense } from 'react';
import { Canvas } from 'react-three-fiber';
import Controls from './Components/Controls';

import Box from './3DModels/Box';
import Pyramid from './3DModels/Pyramid';

import './App.css';

const App: React.FC = () => (
  <Canvas>
    <Suspense fallback={null}>
      <Box
        position={[0, -1, 0]}
        size={[1, 1, 1]}
        rotation={45}
      />

      <Pyramid
        position={[0, 0, 0]}
        size={[1, 1, 5]}
      />

      <Box
        position={[0, 1, 0]}
        size={[1, 1, 1]}
      />
    </Suspense>
    <Controls />
    <gridHelper args={[800, 40]} />
    <axesHelper args={[200]} />
  </Canvas>
);

export default App;
