import {
  faExclamationTriangle,
  faSave,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { useRecoilValue } from 'recoil';

import { lastSaveState } from '../../../atoms';
import Timestamp from '../../Timestamp';
import StatusBarApplet from './StatusBarApplet';

const LastSaved = () => {
  const timestamp = useRecoilValue(lastSaveState);
  const icon = timestamp === null ? faExclamationTriangle : faSave;

  return (
    <StatusBarApplet icon={icon}>
      {timestamp !== null ? (
        <>
          Last save: <Timestamp date={timestamp} />
        </>
      ) : (
        <em>Unsaved document</em>
      )}
    </StatusBarApplet>
  );
};

export default LastSaved;
