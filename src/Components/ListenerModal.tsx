import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { DialogStateReturn } from 'reakit';

import eventBus from '../Utilities/EventBus';
import Modal, { IModalProps } from './Modal';

interface Props<T> extends Omit<IModalProps, 'children'> {
  dialog: DialogStateReturn;
  event: string;
  onOpen?: () => void;
  children: ReactNode | ((eventData?: T) => ReactNode | [ReactNode, ReactNode]);
}

/**
 * A wrapper around the `Modal` component that will automatically show itself
 * when the specified event name is dispatched. When the child given for this
 * Modal is a function, it will pass the event data as an argument that
 * triggered this Modal to appear.
 *
 * @see Modal
 */
const ListenerModal = <T,>({ event, dialog, onOpen, ...props }: Props<T>) => {
  const [eventData, setEventData] = useState<T>();
  const eventBusCallbackId = useRef('');

  // Register this component as a modal that listens to an event
  useEffect(() => {
    eventBusCallbackId.current = eventBus.on(event, (data: T) => {
      dialog.show();
      onOpen?.();
      setEventData(data);
    });

    return () => {
      eventBus.remove(event, eventBusCallbackId.current);
    };
  }, [dialog, event, onOpen]);

  let body: ReactNode | [ReactNode, ReactNode];
  let footer: ReactNode | undefined;

  if (typeof props.children === 'function') {
    const result = props.children(eventData);

    if (Array.isArray(result)) {
      [body, footer] = result;
    } else {
      body = result;
    }
  } else {
    body = props.children;
  }

  return (
    <Modal dialog={dialog} footer={footer} {...props}>
      {body}
    </Modal>
  );
};

export default ListenerModal;
export type { Props as IListenerModalProps };
