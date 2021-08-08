import produce from 'immer';
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useDialogState } from 'reakit';
import { useRecoilState } from 'recoil';

import eventBus from '../../EventBus';
import { WorldSettingsModalOpenEventName } from '../../Events/IWorldSettingsModalOpenEvent';
import { documentState } from '../../atoms';
import Modal from '../Modal';

const WorldSettingsModal = () => {
  const eventBusCallbackId = useRef('');

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
    setSize(world?.size ?? 800);
    setFlagHeight(world?.flagheight ?? 10);
    setNoWalls(world?.nowalls ?? false);
    setFreeCtfSpawns(world?.freectfspawns ?? false);
  }, [world?.size, world?.flagheight, world?.nowalls, world?.freectfspawns]);

  const handleOnChangeWorldSize = (e: ChangeEvent<HTMLInputElement>) => {
    const value = +e.currentTarget.value;

    if (value <= 0) {
      return;
    }

    setSize(value);
  };
  const handleOnChangeFlagHeight = (e: ChangeEvent<HTMLInputElement>) => {
    const value = +e.currentTarget.value;

    if (value < 0) {
      return;
    }

    setFlagHeight(value);
  };
  const handleOnChangeNoWalls = (e: ChangeEvent<HTMLInputElement>) => {
    setNoWalls(e.currentTarget.checked);
  };
  const handleOnChangeFreeCtfSpawns = (e: ChangeEvent<HTMLInputElement>) => {
    setFreeCtfSpawns(e.currentTarget.checked);
  };
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

  useEffect(() => {
    eventBusCallbackId.current = eventBus.on(
      WorldSettingsModalOpenEventName,
      () => {
        syncStateToWorld();
        dialog.show();
      },
    );

    return () => {
      eventBus.remove(
        WorldSettingsModalOpenEventName,
        eventBusCallbackId.current,
      );
    };
  }, [dialog, syncStateToWorld]);

  return (
    <Modal
      dialog={dialog}
      title="World Settings"
      hideOnEsc={false}
      hideOnClickOutside={false}
    >
      <div className="row">
        <div className="col-md-6">
          <label htmlFor="world-size" aria-describedby="world-size-desc">
            World Size
          </label>
          <input
            type="number"
            min={1}
            value={size}
            onChange={handleOnChangeWorldSize}
          />
          <p id="world-size-desc">
            <small className="text-muted">
              The length and width (because all maps are a square) of the map in
              World Units (wu).
            </small>
          </p>
        </div>
        <div className="col-md-6" aria-describedby="flag-height-desc">
          <label htmlFor="flag-height">Flag Height</label>
          <input
            type="number"
            min="1"
            value={flagHeight}
            onChange={handleOnChangeFlagHeight}
          />
          <p className="flag-height-desc">
            <small className="text-muted">
              The height a flag will fly when dropped. This allows flags to be
              passed up through objects.
            </small>
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <label
            aria-describedby="no-walls-desc"
            className="horizontal-checkbox"
          >
            <input
              type="checkbox"
              onChange={handleOnChangeNoWalls}
              checked={noWalls}
            />
            No Walls
          </label>
          <p className="text-muted" id="no-walls-desc">
            <small>
              Do not render walls at the edges of the map. If players drive past
              the edge of the map, they will be kicked. You will need to create
              your own walls.
            </small>
          </p>
        </div>
        <div className="col-md-6">
          <label
            aria-describedby="free-ctf-spawns-desc"
            className="horizontal-checkbox"
          >
            <input
              type="checkbox"
              onChange={handleOnChangeFreeCtfSpawns}
              checked={freeCtfSpawns}
            />
            Free CTF Spawns
          </label>
          <p className="text-muted" id="free-ctf-spawns-desc">
            <small>
              On a CTF map, a player will spawn at their base on join and after
              their team flag has been captured. With "free CTF spawns" enabled,
              players will spawn randomly on the map or on specified zone
              objects.
            </small>
          </p>
        </div>
      </div>
      <button onClick={handleOnClickSave}>Save</button>
    </Modal>
  );
};

export default WorldSettingsModal;
