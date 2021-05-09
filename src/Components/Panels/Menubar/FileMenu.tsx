import React, { forwardRef } from 'react';
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuSeparator,
  useMenuState,
} from 'reakit/Menu';

import styles from './menu-styles.module.scss';

const FileMenu = forwardRef<HTMLButtonElement>((props, ref) => {
  const menu = useMenuState();

  return (
    <>
      <MenuButton ref={ref} {...menu} {...props} className={styles.menuButton}>
        File
      </MenuButton>
      <Menu {...menu} aria-label="File" className={styles.menuDropdown}>
        <MenuItem {...menu}>New Map</MenuItem>
        <MenuItem {...menu}>Open Map</MenuItem>
        <MenuSeparator />
        <MenuItem {...menu}>Save</MenuItem>
        <MenuItem {...menu}>Save As</MenuItem>
      </Menu>
    </>
  );
});

export default FileMenu;
