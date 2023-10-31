import {
	FontAwesomeIcon,
	FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';
import React, { ReactNode } from 'react';

import styles from './StatusBarApplet.module.scss';

interface Props {
	/**
	 * The FontAwesome icon to attach to this menu item.
	 */
	icon?: FontAwesomeIconProps['icon'];

	children: ReactNode;
}

const StatusBarApplet = ({ icon, children }: Props) => {
	return (
		<div className={styles.wrapper}>
			<span className={styles.icon}>
				{icon && <FontAwesomeIcon fixedWidth={true} icon={icon} />}
			</span>
			<span className={styles.body}>{children}</span>
		</div>
	);
};

export default StatusBarApplet;
