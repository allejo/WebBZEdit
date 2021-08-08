import React from 'react';

import HixDocumentLoader from './Components/HixDocumentLoader';
import WorldSettingsModal from './Components/Modals/WorldSettingsModal';
import InventoryPanel from './Components/Panels/InventoryPanel';
import MenubarPanel from './Components/Panels/MenubarPanel';
import RendererPanel from './Components/Panels/RendererPanel';
import ToolboxPanel from './Components/Panels/ToolboxPanel';
import './EventListeners';

import styles from './App.module.scss';

const App: React.FC = () => (
  <div className={styles.wrapper}>
    <div className={styles.Menubar}>
      <HixDocumentLoader />
      <MenubarPanel />
    </div>
    <div className={styles.Renderer}>
      <RendererPanel />
    </div>
    <div className={styles.Sidebar}>
      <InventoryPanel />
    </div>
    <div className={styles.Toolbox}>
      <ToolboxPanel />
    </div>
    {/* All of the app's modals (merely for organizational purposes) */}
    <>
      <WorldSettingsModal />
    </>
  </div>
);

export default App;
