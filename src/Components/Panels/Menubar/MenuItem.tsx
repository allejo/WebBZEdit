import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';
import React, { ReactNode, useEffect } from 'react';
import { MenuItem as ReakitMenuItem, MenuStateReturn } from 'reakit/Menu';

import styles from './MenuItem.module.scss';

interface Props extends MenuStateReturn {
  /**
   * The FontAwesome icon to attach to this menu item.
   */
  icon?: FontAwesomeIconProps['icon'];

  /**
   * The callback to execute when this menu item is clicked or the keyboard
   * short cut is pressed.
   */
  onTrigger?: () => void;

  /**
   * Attach a keyboard shortcut to this menu item.
   */
  shortcut?: {
    /**
     * Whether CTRL or Command is necessary for this shortcut.
     */
    meta?: boolean;

    /**
     * Whether the Shift key is necessary for this shortcut.
     */
    shift?: boolean;

    /**
     * Whether the Option/ALT key  is necessary for this shortcut.
     */
    alt?: boolean;

    /**
     * The key for this shortcut.
     */
    key: string;
  };

  children: ReactNode;
}

function getOS(): string {
  // Source: https://stackoverflow.com/a/38241481
  const userAgent = window.navigator.userAgent,
    platform = window.navigator.platform,
    macosPlatforms = ['Macintosh', 'MacIntel'],
    windowsPlatforms = ['Win32', 'Win64', 'Windows'],
    iosPlatforms = ['iPhone', 'iPad', 'iPod'];

  if (macosPlatforms.indexOf(platform) !== -1) {
    return 'macos';
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    return 'ios';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    return 'windows';
  } else if (/Android/.test(userAgent)) {
    return 'android';
  } else if (/Linux/.test(platform)) {
    return 'linux';
  }

  return 'unknown';
}

function getShortcut(shortcut?: Props['shortcut']): string {
  if (!shortcut) {
    return '';
  }

  const { meta, shift, alt, key } = shortcut;
  const metaChar = getOS() === 'macos' ? '⌘' : 'CTRL';
  const glue = shift || alt ? '+' : '';

  const keys = [
    meta && metaChar,
    shift && 'Shift',
    alt && 'Option',
    key.toLocaleUpperCase(),
  ];

  return keys.filter(Boolean).join(glue);
}

const MenuItem = ({ children, icon, shortcut, onTrigger, ...menu }: Props) => {
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (!shortcut) {
        return;
      }

      const { meta, shift, alt, key } = shortcut;
      const keyPressed = key.charCodeAt(0) === event.keyCode;
      const metaKey = meta == null || (meta && event.metaKey);
      const shiftKey = shift == null || (shift && event.shiftKey);
      const altKey = alt == null || (alt && event.altKey);

      if (keyPressed && metaKey && shiftKey && altKey) {
        event.preventDefault();
        onTrigger?.();
      }
    };

    window.addEventListener('keydown', listener);

    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, [onTrigger, shortcut]);

  return (
    <ReakitMenuItem {...menu} onClick={onTrigger}>
      <span className={styles.icon}>
        {icon && <FontAwesomeIcon fixedWidth={true} icon={icon} />}
      </span>
      <span className={styles.body}>{children}</span>
      {shortcut && (
        <span className={styles.shortcut}>
          <span className="sr-only">(</span>
          {getShortcut(shortcut)}
          <span className="sr-only">)</span>
        </span>
      )}
    </ReakitMenuItem>
  );
};

export default MenuItem;
