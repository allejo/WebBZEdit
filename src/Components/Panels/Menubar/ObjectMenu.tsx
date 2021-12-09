import { faCube, faFlag } from '@fortawesome/free-solid-svg-icons';
import React, { forwardRef } from 'react';
import { Menu, MenuButton, MenuSeparator, useMenuState } from 'reakit/Menu';

import { newIBase } from '../../../Document/Obstacles/Base';
import { newIBox } from '../../../Document/Obstacles/Box';
import { newIPyramid } from '../../../Document/Obstacles/Pyramid';
import { newITeleporter } from '../../../Document/Obstacles/Teleporter';
import { newIZone } from '../../../Document/Obstacles/Zone';
import AddObstacleMenuItem from './ObjectMenu/AddObstacleMenuItem';
import ClearSelectionMenuItem from './ObjectMenu/ClearSelectionMenuItem';
import DeleteSelectedMenuItem from './ObjectMenu/DeleteSelectedMenuItem';

import styles from './menu-styles.module.scss';

const ObjectMenu = forwardRef<HTMLButtonElement>((props, ref) => {
  const menu = useMenuState();

  return (
    <>
      <MenuButton ref={ref} {...menu} {...props} className={styles.menuButton}>
        Object
      </MenuButton>
      <Menu {...menu} aria-label="Object" className={styles.menuDropdown}>
        <AddObstacleMenuItem
          icon={faFlag}
          object="Base"
          factory={newIBase}
          {...menu}
        />
        <AddObstacleMenuItem
          {...menu}
          icon={faCube}
          object="Box"
          factory={newIBox}
          shortcut={{ key: 'B' }}
        />
        <AddObstacleMenuItem
          object="Pyramid"
          factory={newIPyramid}
          {...menu}
          shortcut={{ key: 'P' }}
        />
        <AddObstacleMenuItem
          object="Teleporter"
          factory={newITeleporter}
          shortcut={{ key: 'T' }}
          {...menu}
        />
        <AddObstacleMenuItem
          object="Zone"
          factory={newIZone}
          shortcut={{ key: 'Z' }}
          {...menu}
        />
        <MenuSeparator />
        <ClearSelectionMenuItem {...menu} />
        <DeleteSelectedMenuItem {...menu} />
      </Menu>
    </>
  );
});

export default ObjectMenu;
