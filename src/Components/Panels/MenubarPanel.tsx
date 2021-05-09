import React from 'react';
import { MenuBar, MenuItem, useMenuBarState } from 'reakit';

import FileMenu from './Menubar/FileMenu';

const MenubarPanel = () => {
  const menu = useMenuBarState();

  return (
    <MenuBar {...menu}>
      <MenuItem {...menu} as={FileMenu} />
    </MenuBar>
  );
};

export default MenubarPanel;
