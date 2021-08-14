import { faMousePointer } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { MenuStateReturn } from 'reakit';
import { useRecoilState } from 'recoil';

import { selectionState } from '../../../../atoms';
import MenuItem from '../MenuItem';

interface Props extends MenuStateReturn {}

const ClearSelectionMenuItem = ({ ...menu }: Props) => {
  const [selection, setSelection] = useRecoilState(selectionState);
  const handleOnTriggerMenuItem = () => {
    setSelection(null);
    menu.hide();
  };
  const isDisabled = selection === null;

  return (
    <MenuItem
      {...menu}
      icon={faMousePointer}
      onTrigger={handleOnTriggerMenuItem}
      shortcut={{
        key: ' ', // Space Bar
      }}
      disabled={isDisabled}
    >
      Clear Selection
    </MenuItem>
  );
};

export default ClearSelectionMenuItem;
