import React, { forwardRef } from 'react';
import { Menu, MenuButton, MenuSeparator, useMenuState } from 'reakit/Menu';

import WorldSettingsMenuItem from './WorldMenu/WorldSettingsMenuItem';

import styles from './menu-styles.module.scss';

const WorldMenu = forwardRef<HTMLButtonElement>((props, ref) => {
  const menu = useMenuState();

  return (
    <>
      <MenuButton ref={ref} {...menu} {...props} className={styles.menuButton}>
        World
      </MenuButton>
      <Menu {...menu} aria-label="World" className={styles.menuDropdown}>
        <WorldSettingsMenuItem {...menu} />
        <MenuSeparator />
      </Menu>
    </>
  );
});

export default WorldMenu;
