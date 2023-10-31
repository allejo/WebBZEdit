import dayjs, { Dayjs } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import React, {
  HTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { isDevEnv } from '../Utilities/developmentUtilities';

dayjs.extend(relativeTime);
dayjs.extend(utc);

// These are blacklisted props that this component is setting itself, so we use
// TypeScript to disallow these from being set entirely.
type ExcludedProps = 'children' | 'dateTime' | 'title';
type BaseProps = Omit<HTMLAttributes<HTMLTimeElement>, ExcludedProps>;

interface Props extends BaseProps {
  /**
   * The timestamp to render in a human understandable format. When undefined,
   * "now" is used as the default value when this component is created.
   *
   * If a string is given, it should be in a format that
   * [dayjs](https://github.com/iamkun/dayjs) accepts.
   */
  date?: Date | string | null;

  /**
   * Set to true to disable the auto-refresh functionality.
   */
  disableRefresh?: boolean;

  /**
   * The number of seconds between when this timestamp should refresh its
   * message to have an accurate time.
   */
  refreshRate?: number;
}

const Timestamp = (props: Props) => {
  const {
    date,
    disableRefresh = false,
    refreshRate = 20,
    ...timeProps
  } = props;
  const [content, setContent] = useState<string>('');
  const timestamp = useRef<Dayjs>(dayjs(date || undefined));
  const timeoutID = useRef<number | null>(null);

  const updateContent = () => {
    setContent(timestamp.current.local().fromNow());
  };

  useEffect(() => {
    timestamp.current = dayjs(date || undefined);

    if (!timestamp.current.isValid()) {
      timestamp.current = dayjs();

      // Only output a warning if we're in a non-production environment
      if (isDevEnv()) {
        console.warn(`"${date}" is not a valid date value`);
      }
    }

    updateContent();
  }, [date, timestamp]);

  const heartbeat = useCallback(() => {
    timeoutID.current = window.setTimeout(() => {
      updateContent();
      heartbeat();
    }, refreshRate * 1000);
  }, [refreshRate]);

  useEffect(() => {
    if (disableRefresh) {
      return;
    }

    heartbeat();

    return () => {
      if (timeoutID.current) {
        window.clearTimeout(timeoutID.current);
      }
    };
  }, [disableRefresh, heartbeat]);

  return (
    <time
      {...timeProps}
      dateTime={timestamp.current.toISOString()}
      title={timestamp.current.local().format('dddd, MMMM D, YYYY h:mm A')}
    >
      {content}
    </time>
  );
};

export default Timestamp;
