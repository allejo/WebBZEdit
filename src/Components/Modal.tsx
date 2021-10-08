import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ReactNode, useEffect } from 'react';
import {
  Dialog,
  DialogBackdrop,
  DialogOptions,
  DialogStateReturn,
} from 'reakit';

import {
  IModalToggleEventName,
  ModalToggleEvent,
} from '../Events/IModalToggleEvent';
import eventBus from '../Utilities/EventBus';

import styles from './Modal.module.scss';

interface Props extends Partial<DialogOptions> {
  dialog: DialogStateReturn;
  className?: string;
  onShow?: () => void;
  onDismiss?: () => boolean;
  title: string;
  children: ReactNode;
}

const Modal = ({
  title,
  className,
  dialog,
  onShow,
  onDismiss,
  children,
  ...props
}: Props) => {
  const handleOnClickDismiss = () => {
    const allowDismiss = onDismiss?.() ?? true;

    if (allowDismiss) {
      dialog.hide();
    }
  };

  useEffect(() => {
    if (dialog.visible) {
      onShow?.();
    }

    eventBus.dispatch(
      IModalToggleEventName,
      new ModalToggleEvent(title, dialog.visible),
    );
  }, [dialog.visible, onShow, title]);

  return (
    <DialogBackdrop {...dialog} className={styles.backdrop}>
      <Dialog
        {...dialog}
        aria-label={title}
        {...props}
        className={styles.dialog}
      >
        <header className={styles.header}>
          <h1>{title}</h1>
          <button
            aria-label="Close dialog"
            className={styles.closeDialog}
            onClick={handleOnClickDismiss}
          >
            <FontAwesomeIcon fixedWidth={true} icon={faTimes} />
          </button>
        </header>

        <div className={className}>{children}</div>
      </Dialog>
    </DialogBackdrop>
  );
};

export default Modal;
export type { Props as IModalProps };
