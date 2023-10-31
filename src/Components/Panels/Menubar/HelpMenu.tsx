import React, { forwardRef } from 'react';
import { Menu, MenuButton, useMenuState } from 'reakit/Menu';

import AboutMenuItem from './HelpMenu/AboutMenuItem';

import styles from './menu-styles.module.scss';

const HelpMenu = forwardRef<HTMLButtonElement>((props, ref) => {
	const menu = useMenuState();

	return (
		<>
			<MenuButton ref={ref} {...menu} {...props} className={styles.menuButton}>
				Help
			</MenuButton>
			<Menu {...menu} aria-label="Help" className={styles.menuDropdown}>
				<AboutMenuItem {...menu} />
			</Menu>
		</>
	);
});

export default HelpMenu;
