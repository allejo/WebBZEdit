import produce from 'immer';
import React, { useCallback, useState } from 'react';
import { useDialogState } from 'reakit';
import { useRecoilState } from 'recoil';

import { FriendlyFireMode } from '../../Document/Editor/FriendlyFireEditor';
import {
  GameMode,
  GameModeLiterals,
} from '../../Document/Editor/GameModeEditor';
import { WorldEditorHelper } from '../../Document/Editor/WorldEditorHelper';
import { GameplaySettingsModalOpenEventName } from '../../Events/IGameplaySettingsModalOpenEvent';
import { documentState } from '../../atoms';
import Button from '../Button';
import CheckboxField from '../Form/CheckboxField';
import Fieldset from '../Form/Fieldset';
import SelectField from '../Form/SelectField';
import ListenerModal from '../ListenerModal';

import generalStyles from '../../sass/general.module.scss';

const DEFAULT_GAME_MODE = GameMode.FreeForAll;
const DEFAULT_JUMPING = false;
const DEFAULT_RICOCHET = false;
const DEFAULT_FRIENDLY_FIRE = FriendlyFireMode.WithPenaltyAndSuicide;

const GameplaySettingsModal = () => {
  const [world, setBZWDocument] = useRecoilState(documentState);
  const dialog = useDialogState();

  const [gameMode, setGameMode] = useState(DEFAULT_GAME_MODE);
  const [jumping, setJumping] = useState(DEFAULT_JUMPING);
  const [ricochet, setRicochet] = useState(DEFAULT_RICOCHET);
  const [ffMode, setFFMode] = useState(DEFAULT_FRIENDLY_FIRE);

  const syncWorldToState = useCallback(() => {
    if (!world) {
      return;
    }

    const helper = new WorldEditorHelper(world);

    setGameMode(helper.getGameMode());
    setJumping(helper.isJumpingEnabled());
    setRicochet(helper.areRicochetsEnabled());
    setFFMode(helper.getFriendlyFire());
  }, [world]);

  const isFriendlyFireEnabled = (): boolean =>
    ffMode === FriendlyFireMode.WithPenalty ||
    ffMode === FriendlyFireMode.WithPenaltyAndSuicide;
  const handleGameModeOnChange = (val: string) => setGameMode(val as GameMode);
  const handleFriendlyFireCheckbox = (enabled: boolean) => {
    if (enabled) {
      setFFMode(FriendlyFireMode.WithPenaltyAndSuicide);
    } else {
      setFFMode(FriendlyFireMode.Impossible);
    }
  };
  const handleFriendlyFirePenalty = (option: string) => {
    setFFMode(option as FriendlyFireMode);
  };
  const handleOnClickSave = () => {
    if (!world) {
      return;
    }

    const nextWorld = produce(world, (draftWorld) => {
      const helper = new WorldEditorHelper(draftWorld);

      helper.setGameMode(gameMode);
      helper.enableJumping(jumping);
      helper.enableRicochets(ricochet);
      helper.setFriendlyFire(ffMode);
    });

    setBZWDocument(nextWorld);
    dialog.hide();
  };

  return (
    <ListenerModal
      dialog={dialog}
      event={GameplaySettingsModalOpenEventName}
      title="Gameplay Settings"
      footer={
        <Button type="success" onClick={handleOnClickSave}>
          Save
        </Button>
      }
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
            description="Bullets will bounce off of objects allowing for tanks to perform trick shots without the Ricochet flag."
            onChange={setRicochet}
            value={ricochet}
          />
        </div>
      </div>
      <Fieldset legend="Friendly Fire">
        <div className="row">
          <div className="col-md-6">
            <CheckboxField
              label="Enable Friendly Fire"
              description="When enabled, players can kill their teammates either on accident or on purpose; either incurs a penalty. When disabled, bullets will pass through their teammates not killing them and not incurring a penalty."
              onChange={handleFriendlyFireCheckbox}
              value={isFriendlyFireEnabled()}
            />
          </div>
          <div className="col-md-6">
            {isFriendlyFireEnabled() ? (
              <SelectField
                label="Penalty"
                description="The penalty is imposed on the player who killed their teammate."
                options={{
                  [FriendlyFireMode.WithPenalty]: '-1 point',
                  [FriendlyFireMode.WithPenaltyAndSuicide]:
                    '-1 point & self-destruction',
                }}
                onChange={handleFriendlyFirePenalty}
                value={ffMode}
              />
            ) : (
              <>
                <p className="mb-1">Penalty</p>
                <p className={generalStyles.descriptionLike}>
                  <i>
                    No penalty behavior can be set while friendly fire is
                    disabled.
                  </i>
                </p>
              </>
            )}
          </div>
        </div>
      </Fieldset>
    </ListenerModal>
  );
};

export default GameplaySettingsModal;
