import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faBug, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useDialogState } from 'reakit';

import { AboutModalOpenEventName } from '../../Events/IAboutModalOpenEvent';
import ListenerModal from '../ListenerModal';

import icon from '../../assets/icon.png';
import styles from './AboutModal.module.scss';

const AboutModal = () => {
  const dialog = useDialogState();

  return (
    <ListenerModal
      event={AboutModalOpenEventName}
      dialog={dialog}
      title="About WebBZEdit"
      className={styles.wrapper}
    >
      <div>
        <img src={icon} alt="WebBZEdit logo" className="d-block mx-auto mb-3" />
      </div>
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
    </ListenerModal>
  );
};

export default AboutModal;
