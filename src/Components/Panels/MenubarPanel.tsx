import React from 'react';
import { MenuBar, MenuItem, useMenuBarState } from 'reakit';

import FileMenu from './Menubar/FileMenu';
import WorldMenu from './Menubar/WorldMenu';

import styles from './MenubarPanel.module.scss';

const MenubarPanel = () => {
  const menu = useMenuBarState();

  return (
    <MenuBar {...menu} className={styles.wrapper}>
      <MenuItem {...menu} as={FileMenu} />
      <MenuItem {...menu} as={WorldMenu} />
    </MenuBar>
  );
};

export default MenubarPanel;
