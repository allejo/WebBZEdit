import React, { Suspense, useState } from 'react';
import { Canvas } from 'react-three-fiber';

import Box from './3DModels/Box';
import Pyramid from './3DModels/Pyramid';
import { Box as BZWBox } from './Document/Obstacles/Box';
import OrbitalControls from './Components/CameraControls/OrbitalControls';
import PositionableControls from './Components/ObstacleControls/PositionableControls';

import './App.css';

const box = new BZWBox();
box.position = [5, 0, 0];

const App: React.FC = () => {
  const [object, setObject] = useState(box);

  return (
    <div>
      <Canvas>
        <Suspense fallback={null}>
          <Box obstacle={object} />

          <Pyramid
            position={[0, 0, 0]}
            size={[1, 1, 5]}
          />
        </Suspense>
        <OrbitalControls />
        <gridHelper args={[800, 40]} />
        <axesHelper args={[200]} />
      </Canvas>
      <div>
        <PositionableControls
          data={object}
          onChange={(data) => {
            // @ts-ignore
            setObject({
              ...object,
              position: data.position,
              size: data.size,
              rotation: data.rotation ?? 0,
            });
          }}
        />
      </div>
    </div>
  );
};

export default App;
