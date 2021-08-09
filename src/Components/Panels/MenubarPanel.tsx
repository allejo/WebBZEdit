import React from 'react';
import { MenuBar, MenuItem, useMenuBarState } from 'reakit';

import FileMenu from './Menubar/FileMenu';
import HelpMenu from './Menubar/HelpMenu';
import WorldMenu from './Menubar/WorldMenu';

import styles from './MenubarPanel.module.scss';

const MenubarPanel = () => {
  const menu = useMenuBarState();

  return (
    <MenuBar {...menu} className={styles.wrapper}>
      <MenuItem {...menu} as={FileMenu} />
      <MenuItem {...menu} as={WorldMenu} />
      <MenuItem {...menu} as={HelpMenu} />
    </MenuBar>
  );
};

export default MenubarPanel;
