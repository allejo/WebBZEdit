import {
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

/**
 * We store state inside of an object to force React to trigger a state update
 * since hooks will not trigger an update if the "new" state value is the same
 * as the previous state value.
 *
 * @link https://reactjs.org/docs/hooks-reference.html#bailing-out-of-a-state-update
 */
type State<T> = { value: T };
type Callback<T> = (newState: T) => void;
type ReturnType<T> = [
  T,
  (newState: SetStateAction<T>, callback?: Callback<T>) => void,
];

/**
 * Similar to `useState`, except it has support for triggering a callback after
 * the value has been updated in state.
 *
 * @param initialState The initial value that will be stored
 *
 * @link https://git.io/JM61A
 * @link https://stackoverflow.com/a/61842546
 */
export function useStateWithCallback<T>(initialState: T): ReturnType<T> {
  const [state, setState] = useState<State<T>>({ value: initialState });
  const callbacksRef = useRef<Callback<T> | null>();

  // Use `useCallback` so that the `setState` function keeps the same ref and
  // does not trigger subsequent re-renders.
  const setStateCallback = useCallback(
    (newState: SetStateAction<T>, callback?: Callback<T>) => {
      setState(
        (ps: State<T>): State<T> => ({
          value: newState instanceof Function ? newState(ps.value) : newState,
        }),
      );

      if (callback) {
        callbacksRef.current = callback;
      }
    },
    [],
  );

  useEffect(() => {
    if (callbacksRef.current) {
      callbacksRef.current(state.value);
      callbacksRef.current = null;
    }
  }, [state]);

  return [state.value, setStateCallback];
}
