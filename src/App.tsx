import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';

import HixDocumentLoader from './Components/HixDocumentLoader';
import RendererPanel from './Components/Panels/RendererPanel';

import './App.css';

const App: React.FC = () => {
  return (
    <>
      <HixDocumentLoader />
      <RendererPanel />
    </>
  );
};

export default App;
