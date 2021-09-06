import produce from 'immer';
import React, { useCallback, useState } from 'react';
import { useDialogState } from 'reakit';
import { useRecoilState } from 'recoil';

import { WorldSettingsModalOpenEventName } from '../../Events/IWorldSettingsModalOpenEvent';
import { documentState } from '../../atoms';
import CheckboxField from '../Form/CheckboxField';
import NumberField from '../Form/NumberField';
import { positiveOnly } from '../Form/Validators';
import ListenerModal from '../ListenerModal';

const WorldSettingsModal = () => {
  const [world, setBZWDocument] = useRecoilState(documentState);
  const dialog = useDialogState();

  const [size, setSize] = useState<number>(800);
  const [flagHeight, setFlagHeight] = useState<number>(10);
  const [noWalls, setNoWalls] = useState(false);
  const [freeCtfSpawns, setFreeCtfSpawns] = useState(false);

  // Our state is used to keep track of changes that will be made to the BZW
  // document, changes are queued up and only applied when the "Save" button is
  // hit. Sync our state to the current BZW Document so that we can display the
  // most up to date values to the user.
  const syncStateToWorld = useCallback(() => {
    setSize(world?.size ?? 400);
    setFlagHeight(world?.flagheight ?? 10);
    setNoWalls(world?.nowalls ?? false);
    setFreeCtfSpawns(world?.freectfspawns ?? false);
  }, [world?.size, world?.flagheight, world?.nowalls, world?.freectfspawns]);

  const handleOnClickSave = () => {
    if (!world) {
      return;
    }

    const nextWorld = produce(world, (draftWorld) => {
      draftWorld.size = size;
      draftWorld.flagheight = flagHeight;
      draftWorld.nowalls = noWalls;
      draftWorld.freectfspawns = freeCtfSpawns;
    });

    setBZWDocument(nextWorld);
    dialog.hide();
  };

  return (
    <ListenerModal
      event={WorldSettingsModalOpenEventName}
      dialog={dialog}
      title="World Settings"
      hideOnEsc={false}
      hideOnClickOutside={false}
      onOpen={syncStateToWorld}
    >
      <div className="row mb-3">
        <div className="col-md-6">
          <NumberField
            label="World Size"
            onChange={setSize}
            value={size}
            allowChange={positiveOnly}
            description="The length and width (because all maps are a square) of the map in World Units (wu)."
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-6">
          <CheckboxField
            label="No Walls"
            onChange={setNoWalls}
            value={noWalls}
            description="Do not render walls at the edges of the map. If players drive past the edge of the map, they will be kicked. You will need to create your own walls."
          />
        </div>
        <div className="col-md-6">
          <CheckboxField
            label="Free CTF Spawns"
            onChange={setFreeCtfSpawns}
            value={freeCtfSpawns}
            description="On a CTF map, a player will spawn at their base on join and after their team flag has been captured. With 'free CTF spawns' enabled, players will spawn randomly on the map or on specified zone objects."
          />
        </div>
      </div>
      <button onClick={handleOnClickSave}>Save</button>
    </ListenerModal>
  );
};

export default WorldSettingsModal;
