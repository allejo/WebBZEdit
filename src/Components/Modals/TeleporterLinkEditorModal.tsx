import React from 'react';
import { useDialogState } from 'reakit';

import {
  TeleLinkEditorOpenEvent,
  TeleLinkEditorOpenEventName,
} from '../../Events/ITeleLinkEditorOpenEvent';
import ListenerModal from '../ListenerModal';

const TeleporterLinkEditorModal = () => {
  const dialog = useDialogState();

  return (
    <ListenerModal<TeleLinkEditorOpenEvent>
      dialog={dialog}
      event={TeleLinkEditorOpenEventName}
      title="Teleporter Link Editor"
      hideOnClickOutside={false}
      hideOnEsc={false}
    >
      {(eventData) => JSON.stringify(eventData)}
    </ListenerModal>
  );
};

export default TeleporterLinkEditorModal;
