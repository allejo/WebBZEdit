import produce from 'immer';
import React, { useState } from 'react';
import { useDialogState } from 'reakit';
import { useRecoilState } from 'recoil';

import { IZone } from '../../Document/Obstacles/Zone';
import {
  ZoneEditorOpenEvent,
  ZoneEditorOpenEventName,
} from '../../Events/IZoneEditorOpenEvent';
import { documentState } from '../../atoms';
import Alert, { AlertType } from '../Alert';
import Button from '../Button';
import FlagListEditor from '../FlagListEditor';
import ListenerModal from '../ListenerModal';

const ZoneFlagEditorModal = () => {
  const dialog = useDialogState();
  const [world, setBZWDocument] = useRecoilState(documentState);
  const [flagsDraft, setFlagsDraft] = useState<null | [string, number][]>(null);

  return (
    <ListenerModal<ZoneEditorOpenEvent>
      dialog={dialog}
      event={ZoneEditorOpenEventName}
      hideOnClickOutside={false}
      hideOnEsc={false}
      title="Zone Flag Editor"
    >
      {(eventData) => {
        if (!eventData) {
          return (
            <Alert type={AlertType.Danger} header="Modal Open Error">
              This modal was opened without any event data. Please report this
              as a bug.
            </Alert>
          );
        }

        const isRegularFlags = eventData.getEditorMode() === 'flag';
        const zone = eventData.getZone();
        let flags = flagsDraft ?? zone.zoneflag;

        // Only do this map if we haven't made edits yet, otherwise we use our
        // array of draft edits.
        if (isRegularFlags && !flagsDraft) {
          flags = zone.flag.map((f) => [f, -1]);
        }

        const handleSaveClick = () => {
          const nextWorld = produce(world, (draftWorld) => {
            if (!draftWorld) {
              return;
            }

            const updatedZone = draftWorld.children[zone._uuid] as IZone;

            if (isRegularFlags) {
              updatedZone.flag = flagsDraft?.map((def) => def[0]) ?? [];
            } else {
              updatedZone.zoneflag = flagsDraft ?? [];
            }

            draftWorld.children[zone._uuid] = updatedZone;
          });

          setBZWDocument(nextWorld);
          dialog.hide();
        };

        return (
          <>
            <FlagListEditor
              allowCount={eventData.getEditorMode() === 'zoneFlag'}
              flags={flags}
              onChange={setFlagsDraft}
            />
            <footer>
              <Button type="success" onClick={handleSaveClick}>
                Save
              </Button>
            </footer>
          </>
        );
      }}
    </ListenerModal>
  );
};

export default ZoneFlagEditorModal;
