import React, { forwardRef } from 'react';
import { Menu, MenuButton, useMenuState } from 'reakit/Menu';

import ResetMenuItem from './CameraMenu/ResetMenuItem';

import styles from './menu-styles.module.scss';

const CameraMenu = forwardRef<HTMLButtonElement>((props, ref) => {
	const menu = useMenuState();

	return (
		<>
			<MenuButton ref={ref} {...menu} {...props} className={styles.menuButton}>
				Camera
			</MenuButton>
			<Menu {...menu} aria-label="Camera" className={styles.menuDropdown}>
				<ResetMenuItem {...menu} />
			</Menu>
		</>
	);
});

export default CameraMenu;
