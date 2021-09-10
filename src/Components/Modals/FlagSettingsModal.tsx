import produce from 'immer';
import React, { useCallback, useState } from 'react';
import { useDialogState } from 'reakit';
import { useRecoilState } from 'recoil';

import { FlagSettingsModalOpenEventName } from '../../Events/IFlagSettingsModalOpenEvent';
import bzdbDocumentation from '../../Utilities/BZDBDocumentor';
import { documentState } from '../../atoms';
import Button from '../Button';
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
  }, [world?._options]);

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
      <div className="row mb-3">
        <div className="col-md-6">
          <NumberField
            label="Flag Altitude"
            description={bzdbDocumentation.getDescription('_flagAltitude')}
            allowChange={positiveOnly}
            onChange={setFlagAltitude}
            value={flagAltitude}
          />
        </div>
        <div className="col-md-6">
          <NumberField
            label="Flag Height"
            description={bzdbDocumentation.getDescription('_flagHeight')}
            allowChange={positiveOnly}
            onChange={setFlagHeight}
            value={flagHeight}
          />
        </div>
      </div>
      <div>
        <Button type="success" onClick={handleOnSave}>
          Save
        </Button>
      </div>
    </ListenerModal>
  );
};

export default FlagSettingsModal;
