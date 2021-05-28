import React from 'react';
import { MenuBar, MenuItem, useMenuBarState } from 'reakit';

import FileMenu from './Menubar/FileMenu';

import styles from './MenubarPanel.module.scss';

const MenubarPanel = () => {
  const menu = useMenuBarState();

  return (
    <MenuBar {...menu} className={styles.wrapper}>
      <MenuItem {...menu} as={FileMenu} />
    </MenuBar>
  );
};

export default MenubarPanel;
