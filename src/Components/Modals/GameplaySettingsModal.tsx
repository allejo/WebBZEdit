import produce from 'immer';
import React, { useCallback, useState } from 'react';
import { useDialogState } from 'reakit';
import { useRecoilState } from 'recoil';

import {
  GameMode,
  GameModeLiterals,
} from '../../Document/Editor/GameModeEditor';
import { WorldEditorHelper } from '../../Document/Editor/WorldEditorHelper';
import { GameplaySettingsModalOpenEventName } from '../../Events/IGameplaySettingsModalOpenEvent';
import { documentState } from '../../atoms';
import Button from '../Button';
import CheckboxField from '../Form/CheckboxField';
import SelectField from '../Form/SelectField';
import ListenerModal from '../ListenerModal';

const DEFAULT_GAME_MODE = GameMode.FreeForAll;
const DEFAULT_JUMPING = false;
const DEFAULT_RICOCHET = false;

const GameplaySettingsModal = () => {
  const [world, setBZWDocument] = useRecoilState(documentState);
  const dialog = useDialogState();

  const [gameMode, setGameMode] = useState(DEFAULT_GAME_MODE);
  const [jumping, setJumping] = useState(DEFAULT_JUMPING);
  const [ricochet, setRicochet] = useState(DEFAULT_RICOCHET);

  const syncWorldToState = useCallback(() => {
    if (!world) {
      return;
    }

    const helper = new WorldEditorHelper(world);

    setGameMode(helper.getGameMode());
    setJumping(helper.isJumpingEnabled());
    setRicochet(helper.areRicochetsEnabled());
  }, [world]);

  const handleGameModeOnChange = (val: string) => setGameMode(val as GameMode);
  const handleOnClickSave = () => {
    if (!world) {
      return;
    }

    const nextWorld = produce(world, (draftWorld) => {
      const helper = new WorldEditorHelper(draftWorld);

      helper.setGameMode(gameMode);
      helper.enableJumping(jumping);
      helper.enableRicochets(ricochet);
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
        className="mb-3"
        label="Game Mode"
        options={GameModeLiterals}
        onChange={handleGameModeOnChange}
        value={gameMode}
      />
      <div className="row mb-3">
        <div className="col-md-6">
          <CheckboxField
            label="Enable Jumping"
            description="Tanks will be able to jump from the ground or obstacles without the Wings or Jumping flags."
            onChange={setJumping}
            value={jumping}
          />
        </div>
        <div className="col-md-6">
          <CheckboxField
            label="Enable Ricochets"
            description="Bullets will bounce off of objects allowing for tanks to perform trick shots."
            onChange={setRicochet}
            value={ricochet}
          />
        </div>
      </div>
      <Button type="success" onClick={handleOnClickSave}>
        Save
      </Button>
    </ListenerModal>
  );
};

export default GameplaySettingsModal;
