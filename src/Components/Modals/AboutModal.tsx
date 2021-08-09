import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faBug, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef } from 'react';
import { useDialogState } from 'reakit';

import eventBus from '../../EventBus';
import { AboutModalOpenEventName } from '../../Events/IAboutModalOpenEvent';
import Modal from '../Modal';

import styles from './AboutModal.module.scss';

const AboutModal = () => {
  const eventBusCallbackId = useRef('');
  const dialog = useDialogState();

  useEffect(() => {
    eventBusCallbackId.current = eventBus.on(AboutModalOpenEventName, () => {
      dialog.show();
    });

    return () => {
      eventBus.remove(AboutModalOpenEventName, eventBusCallbackId.current);
    };
  }, [dialog]);

  return (
    <Modal dialog={dialog} title="About WebBZEdit" className={styles.wrapper}>
      <p>
        WebBZEdit is a React-based single-page application that uses WebGL to
        create a map editor for the BZFlag community. It's built by your
        friendly neighborhood interstellar space pirate extraordinaire,{' '}
        <a href="https://allejo.io/" target="_blank" rel="noreferrer">
          allejo
        </a>{' '}
        and a few other contributors.
      </p>
      <dl>
        <dt>Version</dt>
        <dd>{process.env.REACT_APP_VERSION ?? <em>Unknown</em>}</dd>

        <dt>Commit</dt>
        <dd>{process.env.REACT_APP_COMMIT ?? <em>Unknown</em>}</dd>
      </dl>
      <ul>
        <li>
          <a
            href="https://github.com/allejo/WebBZEdit"
            target="_blank"
            rel="noreferrer"
          >
            <FontAwesomeIcon icon={faGithub} fixedWidth={true} />
            GitHub
          </a>
        </li>
        <li>
          <a
            href="https://github.com/allejo/WebBZEdit/issues"
            target="_blank"
            rel="noreferrer"
          >
            <FontAwesomeIcon icon={faBug} fixedWidth={true} />
            Report an Issue
          </a>
        </li>
        <li>
          <a
            href="https://allejo.io/support-me/"
            target="_blank"
            rel="noreferrer"
          >
            <FontAwesomeIcon icon={faHeart} fixedWidth={true} />
            Donate
          </a>
        </li>
      </ul>
    </Modal>
  );
};

export default AboutModal;
