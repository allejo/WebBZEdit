import React, { forwardRef } from 'react';
import { Menu, MenuButton, MenuSeparator, useMenuState } from 'reakit/Menu';

import BZDBSettingsMenuItem from './WorldMenu/BZDBSettingsMenuItem';
import FlagSettingsMenuItem from './WorldMenu/FlagSettingsMenuItem';
import GameplaySettingsMenuItem from './WorldMenu/GameplaySettingsMenuItem';
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
        <BZDBSettingsMenuItem {...menu} />
        <FlagSettingsMenuItem {...menu} />
        <GameplaySettingsMenuItem {...menu} />
      </Menu>
    </>
  );
});

export default WorldMenu;
