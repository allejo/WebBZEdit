import React, {
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import keyboard from '../../Utilities/keyboard';
import BaseFormField, { FieldProps } from './BaseFormField';

interface Props extends FieldProps<string> {}

const KeysWeListenTo = [keyboard.UP, keyboard.DOWN];

const BZDBEquationField = ({
  onChange,
  onKeyDown,
  onKeyUp,
  value,
  ...props
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [lastCursorPos, setLastCursorPos] = useState(0);
  const numericalPositions = useMemo<[number, number][]>(() => {
    const numbers = value.matchAll(/(-?[\d.])+/g);
    const result: [number, number][] = [];

    for (const number of numbers) {
      if (number.index === undefined) {
        continue;
      }

      result.push([number.index, number.index + number[0].length]);
    }

    return result;
  }, [value]);
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (KeysWeListenTo.indexOf(event.key) >= 0) {
      event.preventDefault();
    }
  };
  const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    // We don't have a reference yet, bail out
    if (!inputRef.current) {
      return;
    }

    // If we somehow don't have a starting point for our selection, bail out
    const curPos = inputRef.current.selectionStart;
    if (curPos === null) {
      return;
    }

    // Pressed a key we don't care about
    if (KeysWeListenTo.indexOf(event.key) === -1) {
      return;
    }

    let start = -1;
    let end = -1;

    for (const position of numericalPositions) {
      if (position[0] <= curPos && curPos <= position[1]) {
        start = position[0];
        end = position[1];

        break;
      }
    }

    // Our cursor isn't inside or near a numerical value, bail out
    if (start === -1 || end === -1) {
      return;
    }

    const curSel = value.substring(start, end);
    const isFloat = curSel.includes('.');
    const modVal = event.shiftKey ? 10 : 1;
    let numVal = isFloat ? Number.parseFloat(curSel) : Number.parseInt(curSel);

    if (event.key === keyboard.UP) {
      numVal += modVal;
    } else if (event.key === keyboard.DOWN) {
      numVal -= modVal;
    }

    onChange(`${value.slice(0, start)}${numVal}${value.slice(end)}`);

    // Save our cursor selection so that we can restore it after updates to our
    // equation
    setLastCursorPos(start);
  };

  useEffect(() => {
    if (!inputRef.current || lastCursorPos === -1) {
      return;
    }

    inputRef.current.setSelectionRange(lastCursorPos, lastCursorPos);
    setLastCursorPos(-1);
  }, [lastCursorPos, value]);

  return (
    <BaseFormField<string>
      {...props}
      castStrToType={(s) => s ?? ''}
      castTypeToStr={(s) => s}
      inputRef={inputRef}
      onChange={onChange}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      tag="input"
      type="text"
      value={value}
    />
  );
};

export default BZDBEquationField;
