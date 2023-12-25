import { faFlag } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { MenuStateReturn } from 'reakit';

import {
	FlagSettingsModalOpenEventName,
	IFlagSettingsModalOpenEvent,
} from '../../../../Events/IFlagSettingsModalOpenEvent';
import TriggerModalMenuItem from '../shared/TriggerModalMenuItem';

type Props = MenuStateReturn

const FlagSettingsMenuItem = ({ ...menu }: Props) => (
	<TriggerModalMenuItem<IFlagSettingsModalOpenEvent>
		eventData={{}}
		eventName={FlagSettingsModalOpenEventName}
		icon={faFlag}
		menuName="Flag Settings"
		{...menu}
	/>
);

export default FlagSettingsMenuItem;
