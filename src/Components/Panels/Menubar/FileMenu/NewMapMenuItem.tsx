import { faFile } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { MenuStateReturn } from 'reakit/Menu';
import { useSetRecoilState } from 'recoil';

import { loadBZWDocument } from '../../../../Document/loadBZWDocument';
import { documentState } from '../../../../atoms';
import MenuItem from '../MenuItem';

interface Props extends MenuStateReturn {}

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
