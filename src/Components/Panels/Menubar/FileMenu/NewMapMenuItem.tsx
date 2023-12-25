import { faFile } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { MenuStateReturn } from 'reakit/Menu';
import { useSetRecoilState } from 'recoil';

import { documentState } from '../../../../atoms';
import { loadBZWDocument } from '../../../../Document/loadBZWDocument';
import MenuItem from '../MenuItem';

type Props = MenuStateReturn

const NewMapMenuItem = ({ ...menu }: Props) => {
	const setDocument = useSetRecoilState(documentState);
	const handleMenuItemClick = () => {
		setDocument(loadBZWDocument(''));
	};

	return (
		<MenuItem {...menu} icon={faFile} onTrigger={handleMenuItemClick}>
			New Map
		</MenuItem>
	);
};

export default NewMapMenuItem;
