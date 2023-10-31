import React, { forwardRef } from 'react';
import { Menu, MenuButton, useMenuState } from 'reakit/Menu';

import ToggleBzwViewMenuItem from './DebugMenu/ToggleBzwViewMenuItem';

import styles from './menu-styles.module.scss';

const DebugMenu = forwardRef<HTMLButtonElement>((props, ref) => {
	const menu = useMenuState();

	return (
		<>
			<MenuButton ref={ref} {...menu} {...props} className={styles.menuButton}>
				Debug
			</MenuButton>
			<Menu {...menu} aria-label="Debug" className={styles.menuDropdown}>
				<ToggleBzwViewMenuItem {...menu} />
			</Menu>
		</>
	);
});

export default DebugMenu;
