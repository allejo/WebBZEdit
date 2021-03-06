import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import produce from 'immer';
import { nanoid } from 'nanoid';
import React from 'react';
import { MenuStateReturn } from 'reakit';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { WorldEditorHelper } from '../../../../Document/Editor/WorldEditorHelper';
import { IBaseObject } from '../../../../Document/Obstacles/BaseObject';
import { IWorld } from '../../../../Document/Obstacles/World';
import { documentState, selectionState } from '../../../../atoms';
import MenuItem, { IMenuItemProps } from '../MenuItem';

interface Props extends MenuStateReturn {
  factory: () => IBaseObject;
  icon?: IconDefinition;
  object: string;
  shortcut?: IMenuItemProps['shortcut'];
}

const AddObstacleMenuItem = ({ factory, icon, object, ...menu }: Props) => {
  const [document, setDocument] = useRecoilState(documentState);
  const setSelection = useSetRecoilState(selectionState);
  const handleOnTriggerMenuItem = () => {
    const uuid = nanoid(7);

    const obstacle = factory();
    obstacle._uuid = uuid;
    obstacle.name = `New ${object}`;

    const world = produce(document, (draftWorld: IWorld) => {
      const editor = new WorldEditorHelper(draftWorld);
      editor.addObstacle(obstacle);
    });

    setSelection(uuid);
    setDocument(world);
  };

  return (
    <MenuItem {...menu} icon={icon} onTrigger={handleOnTriggerMenuItem}>
      Add {object}
    </MenuItem>
  );
};

export default AddObstacleMenuItem;
