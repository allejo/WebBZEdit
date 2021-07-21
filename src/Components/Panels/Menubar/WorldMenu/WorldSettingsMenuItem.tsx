import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import produce from 'immer';
import React, { ChangeEvent, useState } from 'react';
import { MenuStateReturn, useDialogState } from 'reakit';
import { useRecoilState } from 'recoil';

import { documentState } from '../../../../atoms';
import Modal from '../../../Modal';
import MenuItem from '../MenuItem';

interface Props extends MenuStateReturn {}

const WorldSettingsMenuItem = ({ ...menu }: Props) => {
  const [world, setBZWDocument] = useRecoilState(documentState);
  const dialog = useDialogState();

  const [size, setSize] = useState(world?.size ?? 800);
  const [flagHeight, setFlagHeight] = useState(world?.flagheight);
  const [noWalls, setNoWalls] = useState(world?.nowalls ?? false);
  const [freeCtfSpawns, setFreeCtfSpawns] = useState(
    world?.freectfspawns ?? false,
  );

  const handleOnChangeNoWalls = (e: ChangeEvent<HTMLInputElement>) => {
    setNoWalls(e.currentTarget.checked);
  };
  const handleOnChangeFreeCtfSpawns = (e: ChangeEvent<HTMLInputElement>) => {
    setFreeCtfSpawns(e.currentTarget.checked);
  };
  const handleOnTriggerMenuItem = () => dialog.show();
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
  };

  return (
    <>
      <MenuItem {...menu} icon={faGlobe} onTrigger={handleOnTriggerMenuItem}>
        World Settings
      </MenuItem>
      <Modal dialog={dialog} title="World Settings" hideOnClickOutside={false}>
        <div className="row">
          <div className="col-md-6">
            <label
              aria-describedby="no-walls-desc"
              className="horizontal-checkbox"
            >
              <input type="checkbox" onChange={handleOnChangeNoWalls} />
              No Walls
            </label>
            <p className="text-muted" id="no-walls-desc">
              <small>
                Do not render walls at the edges of the map. If players drive
                past the edge of the map, they will be kicked. You will need to
                create your own walls.
              </small>
            </p>
          </div>
          <div className="col-md-6">
            <label
              aria-describedby="free-ctf-spawns-desc"
              className="horizontal-checkbox"
            >
              <input type="checkbox" onChange={handleOnChangeFreeCtfSpawns} />
              Free CTF Spawns
            </label>
            <p className="text-muted" id="free-ctf-spawns-desc">
              <small>
                On a CTF map, a player will spawn at their base on join and
                after their team flag has been captured. With "free CTF spawns"
                enabled, players will spawn randomly on the map or on specified
                zone objects.
              </small>
            </p>
          </div>
        </div>
        <button onClick={handleOnClickSave}>Save</button>
      </Modal>
    </>
  );
};

export default WorldSettingsMenuItem;
