import { useCallback, useEffect, useRef, useState } from 'react';

type Callback<T> = ((newState: T) => void) | null;
type ReturnType<T> = [T, (newState: T, callback?: Callback<T>) => void];

/**
 * Similar to `useState`, except it has support for triggering a callback after
 * the value has been updated in state.
 *
 * @param initialState The initial value that will be stored
 *
 * @link https://git.io/JM61A
 */
export function useStateWithCallback<T>(initialState: T): ReturnType<T> {
  const [state, setState] = useState<T>(initialState);
  const [counter, setCounter] = useState(0); // @TODO nasty workaround
  const callbacksRef = useRef<Callback<T>>();

  const setStateCallback = useCallback(
    (newState: T, callback?: Callback<T>) => {
      setState(newState);
      setCounter((c) => c + 1);

      if (callback) {
        callbacksRef.current = callback;
      }
    },
    [],
  );

  useEffect(() => {
    if (callbacksRef.current) {
      callbacksRef.current(state);
      callbacksRef.current = null;
    }
  }, [counter, state]);

  return [state, setStateCallback];
}
