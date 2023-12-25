import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { MenuStateReturn } from 'reakit';

import {
	IWorldSettingsModalOpenEvent,
	WorldSettingsModalOpenEventName,
} from '../../../../Events/IWorldSettingsModalOpenEvent';
import TriggerModalMenuItem from '../shared/TriggerModalMenuItem';

type Props = MenuStateReturn

const WorldSettingsMenuItem = ({ ...menu }: Props) => (
	<TriggerModalMenuItem<IWorldSettingsModalOpenEvent>
		eventData={{}}
		eventName={WorldSettingsModalOpenEventName}
		icon={faGlobe}
		menuName="World Settings"
		{...menu}
	/>
);

export default WorldSettingsMenuItem;
