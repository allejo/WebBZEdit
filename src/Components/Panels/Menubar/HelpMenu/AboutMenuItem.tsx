import { faInfo } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { MenuStateReturn } from 'reakit';

import {
  AboutModalOpenEventName,
  IAboutModalOpenEvent,
} from '../../../../Events/IAboutModalOpenEvent';
import eventBus from '../../../../Utilities/EventBus';
import MenuItem from '../MenuItem';

interface Props extends MenuStateReturn {}

const AboutMenuItem = ({ ...menu }: Props) => {
  const handleOnTriggerMenuItem = () => {
    eventBus.dispatch<IAboutModalOpenEvent>(AboutModalOpenEventName, {});
  };

  return (
    <MenuItem {...menu} icon={faInfo} onTrigger={handleOnTriggerMenuItem}>
      About
    </MenuItem>
  );
};

export default AboutMenuItem;
