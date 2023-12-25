import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import {
	faCheck,
	faExclamationTriangle,
	faInfoCircle,
	faTimes,
	faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { HTMLAttributes, ReactNode, useState } from 'react';

import { AlertType } from '../Utilities/contracts';
import { classList } from '../Utilities/cssClasses';

import styles from './Alert.module.scss';

interface Props extends HTMLAttributes<HTMLDivElement> {
	type: AlertType;
	header: ReactNode;
	isDismissible?: boolean;
	children: ReactNode;
}

const CSSStyles: Record<AlertType, string> = {
	[AlertType.Info]: styles.styleInfo,
	[AlertType.Success]: styles.styleSuccess,
	[AlertType.Warning]: styles.styleWarning,
	[AlertType.Danger]: styles.styleDanger,
};

const Icons: Record<AlertType, IconDefinition> = {
	[AlertType.Info]: faInfoCircle,
	[AlertType.Success]: faCheck,
	[AlertType.Warning]: faExclamationTriangle,
	[AlertType.Danger]: faTimesCircle,
};

const Alert = ({
	className,
	header,
	isDismissible = false,
	type,
	children,
}: Props) => {
	const [dismissed, setDismissed] = useState(false);

	if (dismissed) {
		return null;
	}

	const onDismissClick = () => setDismissed(true);
	const classes = classList([styles.wrapper, CSSStyles[type], className]);

	return (
		<div className={classes} role="alert">
			<div className={styles.iconContainer}>
				<FontAwesomeIcon fixedWidth={true} icon={Icons[type]} />
			</div>
			<div className={styles.bodyContainer}>
				<header className={styles.header}>{header}</header>

				{children}
			</div>
			{isDismissible && (
				<div className={styles.dismissContainer}>
					<button
						className={styles.dismissButton}
						aria-label="Dismiss alert"
						onClick={onDismissClick}
					>
						<FontAwesomeIcon icon={faTimes} />
					</button>
				</div>
			)}
		</div>
	);
};

export default Alert;
export type { Props as IAlertProps };
