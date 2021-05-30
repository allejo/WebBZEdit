import { faFile } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { MenuStateReturn } from 'reakit/Menu';
import { useSetRecoilState } from 'recoil';

import { parseBZWDocument } from '../../../../Document/parseBZWDocument';
import { documentState } from '../../../../atoms';
import MenuItem from '../MenuItem';

interface Props extends MenuStateReturn {}

const NewMapMenuItem = ({ ...menu }: Props) => {
  const setDocument = useSetRecoilState(documentState);
  const handleMenuItemClick = () => {
    setDocument(parseBZWDocument(''));
  };

  return (
    <MenuItem {...menu} icon={faFile} onTrigger={handleMenuItemClick}>
      New Map
    </MenuItem>
  );
};

export default NewMapMenuItem;
