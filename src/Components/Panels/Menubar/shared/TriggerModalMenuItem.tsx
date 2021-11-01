import React from 'react';

import eventBus from '../../../../Utilities/EventBus';
import MenuItem, { IMenuItemProps } from '../MenuItem';

interface Props<T> extends Omit<IMenuItemProps, 'children' | 'onTrigger'> {
  eventData: T;
  eventName: string;
  menuName: string;
}

const TriggerModalMenuItem = <T extends {}>({
  eventData,
  eventName,
  menuName,
  ...menu
}: Props<T>) => {
  const handleOnTriggerMenuItem = () => {
    eventBus.dispatch<T>(eventName, eventData);
  };

  return (
    <MenuItem {...menu} onTrigger={handleOnTriggerMenuItem}>
      {menuName}
    </MenuItem>
  );
};

export default TriggerModalMenuItem;
