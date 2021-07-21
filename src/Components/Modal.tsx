import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ReactNode } from 'react';
import {
  Dialog,
  DialogBackdrop,
  DialogOptions,
  DialogStateReturn,
} from 'reakit';

import styles from './Modal.module.scss';

interface Props extends Partial<DialogOptions> {
  dialog: DialogStateReturn;
  title: string;
  children: ReactNode;
}

const Modal = ({ title, dialog, children, ...props }: Props) => (
  <DialogBackdrop {...dialog} className={styles.backdrop}>
    <Dialog {...dialog} aria-label={title} {...props} className={styles.dialog}>
      <header className={styles.header}>
        <h1>{title}</h1>
        <button aria-label="Close dialog" className={styles.closeDialog}>
          <FontAwesomeIcon fixedWidth={true} icon={faTimes} />
        </button>
      </header>

      {children}
    </Dialog>
  </DialogBackdrop>
);

export default Modal;
