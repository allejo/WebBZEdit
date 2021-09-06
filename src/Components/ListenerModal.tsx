import React, { useEffect, useRef } from 'react';
import { DialogStateReturn } from 'reakit';

import eventBus from '../Utilities/EventBus';
import Modal, { IModalProps } from './Modal';

interface Props extends IModalProps {
  dialog: DialogStateReturn;
  event: string;
  onOpen?: () => void;
}

/**
 * A wrapper around the `Modal` component that will automatically show itself
 * when the specified event name is dispatched.
 *
 * @see Modal
 */
const ListenerModal = ({ event, dialog, onOpen, ...props }: Props) => {
  const eventBusCallbackId = useRef('');

  // Register this component as a modal that listens to an event
  useEffect(() => {
    eventBusCallbackId.current = eventBus.on(event, () => {
      dialog.show();
      onOpen?.();
    });

    return () => {
      eventBus.remove(event, eventBusCallbackId.current);
    };
  }, [dialog, event, onOpen]);

  return (
    <Modal dialog={dialog} {...props}>
      {props.children}
    </Modal>
  );
};

export default ListenerModal;
export type { Props as IListenerModalProps };
