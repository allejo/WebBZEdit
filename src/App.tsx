import React from 'react';
import { RecoilRoot } from 'recoil';

import HixDocumentLoader from './Components/HixDocumentLoader';
import RendererPanel from './Components/Panels/RendererPanel';

import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

const App: React.FC = () => {
  return (
    <RecoilRoot>
      <HixDocumentLoader />
      <RendererPanel />
    </RecoilRoot>
  );
};

export default App;
