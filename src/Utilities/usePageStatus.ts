import { useCallback, useEffect, useRef, useState } from 'react';

import {
  IModalToggleEvent,
  IModalToggleEventName,
} from '../Events/IModalToggleEvent';
import eventBus from './EventBus';
import keyboard from './keyboard';

export interface IPageStatus {
  isHoldingShift: boolean;
  isModalOpen: boolean;
  isSomethingFocused: boolean;
}

export function usePageStatus(): IPageStatus {
  const isModalOpenRef = useRef<string>('');
  const [isHoldingShift, setIsHoldingShift] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSomethingFocused, setIsSomethingFocused] = useState(false);

  const shiftDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isHoldingShift) {
        setIsHoldingShift(e.key === keyboard.SHIFT);
      }
    },
    [isHoldingShift, setIsHoldingShift],
  );
  const shiftUp = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === keyboard.SHIFT) {
        setIsHoldingShift(false);
      }
    },
    [setIsHoldingShift],
  );

  // Listen for when shift is held down
  useEffect(() => {
    document.addEventListener('keydown', shiftDown);
    document.addEventListener('keyup', shiftUp);

    return () => {
      document.removeEventListener('keydown', shiftDown);
      document.removeEventListener('keyup', shiftUp);
    };
  }, [shiftDown, shiftUp]);

  const onFocus = useCallback(() => setIsSomethingFocused(true), []);
  const onBlur = useCallback(() => setIsSomethingFocused(false), []);

  // Listen to when an input field gains focus
  useEffect(() => {
    window.addEventListener('focus', onFocus, true);
    window.addEventListener('blur', onBlur, true);

    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
    };
  }, [onFocus, onBlur]);

  useEffect(() => {
    isModalOpenRef.current = eventBus.on<IModalToggleEvent>(
      IModalToggleEventName,
      (event: IModalToggleEvent) => {
        setIsModalOpen(event.isVisible());
      },
    );

    return () => {
      eventBus.remove(IModalToggleEventName, isModalOpenRef.current);
    };
  }, []);

  return {
    isHoldingShift,
    isModalOpen,
    isSomethingFocused,
  };
}
