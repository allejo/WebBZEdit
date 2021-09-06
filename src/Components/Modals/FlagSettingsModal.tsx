import produce from 'immer';
import React, { useCallback, useState } from 'react';
import { useDialogState } from 'reakit';
import { useRecoilState } from 'recoil';

import { FlagSettingsModalOpenEventName } from '../../Events/IFlagSettingsModalOpenEvent';
import { documentState } from '../../atoms';
import NumberField from '../Form/NumberField';
import { positiveOnly } from '../Form/Validators';
import ListenerModal from '../ListenerModal';

const DEFAULT_FLAG_ALTITUDE = 11;
const DEFAULT_FLAG_HEIGHT = 10;

const FlagSettingsModal = () => {
  const [world, setBZWDocument] = useRecoilState(documentState);
  const dialog = useDialogState();

  const [flagAltitude, setFlagAltitude] = useState(DEFAULT_FLAG_ALTITUDE);
  const [flagHeight, setFlagHeight] = useState(DEFAULT_FLAG_HEIGHT);

  const syncStateToWorld = useCallback(() => {
    const sets = world?._options?.['-set'] ?? {};

    setFlagAltitude(+(sets._flagAltitude ?? DEFAULT_FLAG_ALTITUDE));
    setFlagHeight(+(sets._flagHeight ?? DEFAULT_FLAG_HEIGHT));
  }, [world]);

  const handleOnSave = () => {
    if (!world) {
      return;
    }

    const nextWorld = produce(world, (draftWorld) => {
      if (draftWorld._options['-set'] === undefined) {
        draftWorld._options['-set'] = {};
      }

      draftWorld._options['-set']._flagAltitude = flagAltitude + '';
      draftWorld._options['-set']._flagHeight = flagHeight + '';
    });

    setBZWDocument(nextWorld);
    dialog.hide();
  };

  return (
    <ListenerModal
      event={FlagSettingsModalOpenEventName}
      dialog={dialog}
      title="Flag Settings"
      onOpen={syncStateToWorld}
      hideOnEsc={false}
      hideOnClickOutside={false}
    >
      <div className="row">
        <div className="col-md-6">
          <NumberField
            label="Flag Altitude"
            description="The visual Z-axis height in World Units (wu), relative to a tank's position, that flags will fly up relative to its first clearance when dropped and the height at which flags will spawn (and subsequently fall)."
            allowChange={positiveOnly}
            onChange={setFlagAltitude}
            value={flagAltitude}
          />
        </div>
        <div className="col-md-6">
          <NumberField
            label="Flag Height"
            description="The Z-axis height in World Units (wu), relative to a tank's position, that a flag will be able to fly upwards before looking for a new clearance."
            allowChange={positiveOnly}
            onChange={setFlagHeight}
            value={flagHeight}
          />
        </div>
      </div>
      <div>
        <button onClick={handleOnSave}>Save</button>
      </div>
    </ListenerModal>
  );
};

export default FlagSettingsModal;
