import { faCamera } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { MenuStateReturn } from 'reakit';

import {
  CameraPositionResetEvent,
  ICameraPositionResetEvent,
} from '../../../../Events/ICameraPositionResetEvent';
import eventBus from '../../../../Utilities/EventBus';
import MenuItem from '../MenuItem';

interface Props extends MenuStateReturn {}

const ResetMenuItem = ({ ...menu }: Props) => {
  const handleOnTriggerMenuItem = () => {
    eventBus.dispatch<ICameraPositionResetEvent>(CameraPositionResetEvent, {});
  };

  return (
    <MenuItem
      {...menu}
      icon={faCamera}
      onTrigger={handleOnTriggerMenuItem}
      shortcut={{
        key: 'R',
      }}
    >
      Reset
    </MenuItem>
  );
};

export default ResetMenuItem;
