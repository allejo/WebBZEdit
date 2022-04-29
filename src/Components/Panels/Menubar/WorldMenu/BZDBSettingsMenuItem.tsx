import { faTools } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { MenuStateReturn } from 'reakit';

import {
  BZDBSettingsModalOpenEventName,
  IBZDBSettingsModalOpenEvent,
} from '../../../../Events/IBZDBSettingsModalOpenEvent';
import TriggerModalMenuItem from '../shared/TriggerModalMenuItem';

interface Props extends MenuStateReturn {}

const BZDBSettingsMenuItem = ({ ...menu }: Props) => (
  <TriggerModalMenuItem<IBZDBSettingsModalOpenEvent>
    eventData={{}}
    eventName={BZDBSettingsModalOpenEventName}
    icon={faTools}
    menuName="BZDB Settings"
    {...menu}
  />
);

export default BZDBSettingsMenuItem;
