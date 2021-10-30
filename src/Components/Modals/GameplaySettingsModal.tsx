import produce from 'immer';
import React, { useCallback, useState } from 'react';
import { useDialogState } from 'reakit';
import { useRecoilState } from 'recoil';

import { GameMode, GameModeLiterals } from '../../Document/Utilities/GameMode';
import { WorldEditorHelper } from '../../Document/Utilities/WorldEditorHelper';
import { GameplaySettingsModalOpenEventName } from '../../Events/IGameplaySettingsModalOpenEvent';
import { documentState } from '../../atoms';
import Button from '../Button';
import SelectField from '../Form/SelectField';
import ListenerModal from '../ListenerModal';

const DEFAULT_GAME_MODE = GameMode.FreeForAll;

const GameplaySettingsModal = () => {
  const [world, setBZWDocument] = useRecoilState(documentState);
  const dialog = useDialogState();

  const [gameMode, setGameMode] = useState(DEFAULT_GAME_MODE);

  const syncWorldToState = useCallback(() => {
    if (!world) {
      return;
    }

    const helper = new WorldEditorHelper(world);

    setGameMode(helper.getGameMode());
  }, [world]);

  const handleGameModeOnChange = (val: string) => setGameMode(val as GameMode);
  const handleOnClickSave = () => {
    if (!world) {
      return;
    }

    const nextWorld = produce(world, (draftWorld) => {
      const helper = new WorldEditorHelper(draftWorld);

      helper.setGameMode(gameMode);
    });

    setBZWDocument(nextWorld);
    dialog.hide();
  };

  return (
    <ListenerModal
      dialog={dialog}
      event={GameplaySettingsModalOpenEventName}
      title="Gameplay Settings"
      hideOnEsc={false}
      hideOnClickOutside={false}
      onOpen={syncWorldToState}
    >
      <SelectField
        options={GameModeLiterals}
        label="Game Mode"
        onChange={handleGameModeOnChange}
        value={gameMode}
      />
      <Button type="success" onClick={handleOnClickSave}>
        Save
      </Button>
    </ListenerModal>
  );
};

export default GameplaySettingsModal;
