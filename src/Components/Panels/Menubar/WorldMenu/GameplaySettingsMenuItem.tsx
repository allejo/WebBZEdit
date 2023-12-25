import { faGamepad } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { MenuStateReturn } from 'reakit';

import {
	GameplaySettingsModalOpenEventName,
	IGameplaySettingsModalOpenEvent,
} from '../../../../Events/IGameplaySettingsModalOpenEvent';
import TriggerModalMenuItem from '../shared/TriggerModalMenuItem';

type Props = MenuStateReturn

const GameplaySettingsMenuItem = ({ ...menu }: Props) => (
	<TriggerModalMenuItem<IGameplaySettingsModalOpenEvent>
		eventData={{}}
		eventName={GameplaySettingsModalOpenEventName}
		icon={faGamepad}
		menuName="Gameplay Settings"
		{...menu}
	/>
);

export default GameplaySettingsMenuItem;
