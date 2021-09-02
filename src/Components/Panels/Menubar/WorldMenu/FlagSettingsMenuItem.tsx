import { faFlag } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { MenuStateReturn } from 'reakit';

import {
  FlagSettingsModalOpenEventName,
  IFlagSettingsModalOpenEvent,
} from '../../../../Events/IFlagSettingsModalOpenEvent';
import eventBus from '../../../../Utilities/EventBus';
import MenuItem from '../MenuItem';

interface Props extends MenuStateReturn {}

const FlagSettingsMenuItem = ({ ...menu }: Props) => {
  const handleOnTriggerMenuItem = () => {
    eventBus.dispatch<IFlagSettingsModalOpenEvent>(
      FlagSettingsModalOpenEventName,
      {},
    );
  };

  return (
    <MenuItem {...menu} icon={faFlag} onTrigger={handleOnTriggerMenuItem}>
      Flag Settings
    </MenuItem>
  );
};

export default FlagSettingsMenuItem;
