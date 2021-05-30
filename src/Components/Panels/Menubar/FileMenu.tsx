import React, { forwardRef } from 'react';
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuSeparator,
  useMenuState,
} from 'reakit/Menu';

import NewMapMenuItem from './FileMenu/NewMapMenuItem';
import OpenMapMenuItem from './FileMenu/OpenMapMenuItem';

import styles from './menu-styles.module.scss';

const FileMenu = forwardRef<HTMLButtonElement>((props, ref) => {
  const menu = useMenuState();

  return (
    <>
      <MenuButton ref={ref} {...menu} {...props} className={styles.menuButton}>
        File
      </MenuButton>
      <Menu {...menu} aria-label="File" className={styles.menuDropdown}>
        <NewMapMenuItem {...menu} />
        <OpenMapMenuItem {...menu} />
        <MenuSeparator />
        <MenuItem {...menu}>Save</MenuItem>
        <MenuItem {...menu}>Save As</MenuItem>
      </Menu>
    </>
  );
});

export default FileMenu;
