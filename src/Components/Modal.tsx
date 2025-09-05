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
import { classList } from '../Utilities/cssClasses';

import styles from './Modal.module.scss';

interface Props extends Partial<DialogOptions> {
  badgeText?: string;
  dialog: DialogStateReturn;
  className?: string;
  footer?: ReactNode;
  fullWidth?: boolean;
  headerLink?: string;
  headerLinkText?: string;
  onShow?: () => void;
  onDismiss?: () => boolean;
  title: string;
  children: ReactNode;
}

const Modal = ({
  title,
  badgeText,
  className,
  dialog,
  footer,
  fullWidth = false,
  headerLink,
  headerLinkText,
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
        className={classList([styles.dialog, [styles.fullWidth, fullWidth]])}
      >
        <header className={styles.header}>
          <div className={styles.lhs}>
            <h1>{title}</h1>
            {badgeText && (
              <div className="d-flex align-self-start">
                <span className={styles.badge}>{badgeText}</span>
              </div>
            )}
          </div>
          <div className={styles.rhs}>
            {headerLink && headerLinkText && (
              <a
                className={styles.headerLink}
                href={headerLink}
                target="_blank"
                rel="noreferrer"
              >
                {headerLinkText}
              </a>
            )}
            <button
              aria-label="Close dialog"
              className={styles.closeDialog}
              onClick={handleOnClickDismiss}
            >
              <FontAwesomeIcon fixedWidth={true} icon={faTimes} />
            </button>
          </div>
        </header>

        <div className={classList([styles.body, className])}>{children}</div>

        {footer && <footer className={styles.footer}>{footer}</footer>}
      </Dialog>
    </DialogBackdrop>
  );
};

export default Modal;
export type { Props as IModalProps };
