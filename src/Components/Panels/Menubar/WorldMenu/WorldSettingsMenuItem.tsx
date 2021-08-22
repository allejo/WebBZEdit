import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { MenuStateReturn } from 'reakit';

import {
  IWorldSettingsModalOpenEvent,
  WorldSettingsModalOpenEventName,
} from '../../../../Events/IWorldSettingsModalOpenEvent';
import eventBus from '../../../../Utilities/EventBus';
import MenuItem from '../MenuItem';

interface Props extends MenuStateReturn {}

const WorldSettingsMenuItem = ({ ...menu }: Props) => {
  const handleOnTriggerMenuItem = () => {
    eventBus.dispatch<IWorldSettingsModalOpenEvent>(
      WorldSettingsModalOpenEventName,
      {},
    );
  };

  return (
    <MenuItem {...menu} icon={faGlobe} onTrigger={handleOnTriggerMenuItem}>
      World Settings
    </MenuItem>
  );
};

export default WorldSettingsMenuItem;
