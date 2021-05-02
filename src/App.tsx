import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';

import HixDocumentLoader from './Components/HixDocumentLoader';
import InventoryPanel from './Components/Panels/InventoryPanel';
import RendererPanel from './Components/Panels/RendererPanel';
import ToolboxPanel from './Components/Panels/ToolboxPanel';

import styles from './App.module.scss';

const App: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <HixDocumentLoader />
      <div className={styles.menubar}>File</div>
      <div className={styles.hud}>
        <div className={`row ${styles.application}`}>
          <div className="col-sm-9 col-lg-10 p-0">
            <div className={styles.renderer}>
              <RendererPanel />
            </div>
          </div>
          <div className="col-sm-3 col-lg-2">
            <div className={styles.sidebar}>
              <InventoryPanel />
            </div>
          </div>
        </div>
        <div className={styles.toolbar}>
          <ToolboxPanel />
        </div>
      </div>
    </div>
  );
};

export default App;
