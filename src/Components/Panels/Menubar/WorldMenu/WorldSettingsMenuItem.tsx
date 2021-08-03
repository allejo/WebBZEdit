import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { MenuStateReturn } from 'reakit';

import eventBus from '../../../../EventBus';
import {
  IWorldSettingsModalOpenData,
  WorldSettingsModalOpenEvent,
} from '../../../Modals/WorldSettingsModal';
import MenuItem from '../MenuItem';

interface Props extends MenuStateReturn {}

const WorldSettingsMenuItem = ({ ...menu }: Props) => {
  const handleOnTriggerMenuItem = () => {
    eventBus.dispatch<IWorldSettingsModalOpenData>(
      WorldSettingsModalOpenEvent,
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
