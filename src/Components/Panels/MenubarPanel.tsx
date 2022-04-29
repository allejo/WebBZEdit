import React from 'react';
import { MenuBar, MenuItem, useMenuBarState } from 'reakit';

import CameraMenu from './Menubar/CameraMenu';
import DebugMenu from './Menubar/DebugMenu';
import FileMenu from './Menubar/FileMenu';
import HelpMenu from './Menubar/HelpMenu';
import ObjectMenu from './Menubar/ObjectMenu';
import WorldMenu from './Menubar/WorldMenu';

import styles from './MenubarPanel.module.scss';

const MenubarPanel = () => {
  const menu = useMenuBarState();

  return (
    <MenuBar {...menu} className={styles.wrapper}>
      <MenuItem {...menu} as={FileMenu} />
      <MenuItem {...menu} as={ObjectMenu} />
      <MenuItem {...menu} as={CameraMenu} />
      <MenuItem {...menu} as={WorldMenu} />
      {process.env.NODE_ENV === 'development' && (
        <MenuItem {...menu} as={DebugMenu} />
      )}
      <MenuItem {...menu} as={HelpMenu} />
    </MenuBar>
  );
};

export default MenubarPanel;
