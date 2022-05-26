import React from 'react';
import { useRecoilValue } from 'recoil';

import HixDocumentLoader from './Components/HixDocumentLoader';
import AboutModal from './Components/Modals/AboutModal';
import BZDBSettingsModal from './Components/Modals/BZDBSettingsModal';
import FlagSettingsModal from './Components/Modals/FlagSettingsModal';
import GameplaySettingsModal from './Components/Modals/GameplaySettingsModal';
import TeleporterLinkEditorModal from './Components/Modals/TeleporterLinkEditorModal';
import WorldSettingsModal from './Components/Modals/WorldSettingsModal';
import ZoneFlagEditorModal from './Components/Modals/ZoneFlagEditorModal';
import InventoryPanel from './Components/Panels/InventoryPanel';
import MenubarPanel from './Components/Panels/MenubarPanel';
import RendererPanel from './Components/Panels/RendererPanel';
import StatusBarPanel from './Components/Panels/StatusBarPanel';
import ToolboxPanel from './Components/Panels/ToolboxPanel';
import { exportBZWDocument } from './Document/exportBZWDocument';
import './EventListeners';
import { bzwViewState, documentState } from './atoms';

import styles from './App.module.scss';

const App: React.FC = () => {
  const bzwDocument = useRecoilValue(documentState);
  const isDebugPanelVisible = useRecoilValue(bzwViewState);

  return (
    <div className={styles.Viewport}>
      <div className={styles.Application}>
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
        <div className={styles.StatusBar}>
          <StatusBarPanel />
        </div>
        {/* All of the app's modals (merely for organizational purposes) */}
        <>
          <AboutModal />
          <BZDBSettingsModal />
          <FlagSettingsModal />
          <GameplaySettingsModal />
          <TeleporterLinkEditorModal />
          <WorldSettingsModal />
          <ZoneFlagEditorModal />
        </>
      </div>
      {process.env.NODE_ENV === 'development' && isDebugPanelVisible && (
        <div className={styles.DebugPanel}>
          <textarea disabled value={exportBZWDocument(bzwDocument)} />
        </div>
      )}
    </div>
  );
};

export default App;
