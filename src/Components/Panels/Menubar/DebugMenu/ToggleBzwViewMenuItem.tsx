import { faFileCode } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { MenuStateReturn } from 'reakit/Menu';
import { useRecoilState } from 'recoil';

import { bzwViewState } from '../../../../atoms';
import MenuItem from '../MenuItem';

type Props = MenuStateReturn

const ToggleBzwViewMenuItem = ({ ...menu }: Props) => {
	const [isVisible, setIsVisible] = useRecoilState(bzwViewState);
	const handleMenuItemClick = () => {
		setIsVisible(!isVisible);
	};

	return (
		<MenuItem {...menu} icon={faFileCode} onTrigger={handleMenuItemClick}>
			Toggle BZW View
		</MenuItem>
	);
};

export default ToggleBzwViewMenuItem;
