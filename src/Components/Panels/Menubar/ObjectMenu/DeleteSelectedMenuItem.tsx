import { faTrash } from '@fortawesome/free-solid-svg-icons';
import produce from 'immer';
import React from 'react';
import { MenuStateReturn } from 'reakit';
import { useRecoilState } from 'recoil';

import { IWorld } from '../../../../Document/Obstacles/World';
import { documentState, selectionState } from '../../../../atoms';
import MenuItem from '../MenuItem';

interface Props extends MenuStateReturn {}

const DeleteSelectedMenuItem = ({ ...menu }: Props) => {
  const [document, setDocument] = useRecoilState(documentState);
  const [selected, setSelected] = useRecoilState(selectionState);
  const handleOnTriggerMenuItem = () => {
    const world = produce(document, (draftWorld: IWorld) => {
      if (!selected) {
        return;
      }

      setSelected(null);
      delete draftWorld.children[selected];
    });

    setDocument(world);
    menu.hide();
  };
  const isDisabled = selected === null;

  return (
    <MenuItem
      {...menu}
      icon={faTrash}
      onTrigger={handleOnTriggerMenuItem}
      shortcut={{
        key: 'BACKSPACE',
        meta: true,
      }}
      disabled={isDisabled}
    >
      Delete Selected
    </MenuItem>
  );
};

export default DeleteSelectedMenuItem;
