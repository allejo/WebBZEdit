import React, { KeyboardEvent, useState } from 'react';

import keyboard from '../../Utilities/keyboard';
import { safeValueInRange } from '../../Utilities/math';
import BaseFormField, { FieldProps, FormFieldEvent } from './BaseFormField';

interface Props extends FieldProps<number> {
  minValue?: number;
  maxValue?: number;
  cycleValues?: boolean;
  inclusive?: boolean;
}

const NumberField = ({
  cycleValues = false,
  minValue,
  maxValue,
  onChange,
  value,
  inclusive = true,
  ...props
}: Props) => {
  const [inFocus, setInFocus] = useState(false);

  const safeOnChange = (value: number) => {
    console.log(
      `safeOnChange: value=${value}, minValue=${minValue}, maxValue=${maxValue}`,
    );
    const safeValue = safeValueInRange(
      value,
      minValue,
      maxValue,
      cycleValues,
      inclusive,
    );

    onChange(safeValue);
  };

  const handleOnBlur = () => {
    setInFocus(false);
    safeOnChange(value);
  };
  const handleOnChange = (newValue: number, event: FormFieldEvent) => {
    const { inputType } = event.nativeEvent as InputEvent;
    const fromSpinner =
      inputType === undefined || inputType === 'insertReplacementText';

    if (fromSpinner) {
      safeOnChange(newValue);

      return;
    }

    if (isNaN(newValue)) {
      setInFocus(true);
    } else {
      setInFocus(false);

      onChange(newValue);
    }
  };
  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    const allowList = [keyboard.UP, keyboard.DOWN];

    if (allowList.indexOf(event.key) >= 0) {
      event.preventDefault();

      const value = +event.currentTarget.value;
      const modifier = event.shiftKey ? 10 : 1;
      let newValue = value;

      if (event.key === keyboard.UP) {
        newValue += modifier;
      } else if (event.key === keyboard.DOWN) {
        newValue -= modifier;
      }

      safeOnChange(newValue);
    }
  };

  return (
    <BaseFormField<number>
      tag="input"
      type="number"
      castStrToType={(s) => (s === null || s === '' ? NaN : +s)}
      castTypeToStr={(v) => (isNaN(v) ? '' : v + '')}
      onChange={handleOnChange}
      onKeyDown={handleKeyPress}
      onBlur={handleOnBlur}
      value={inFocus ? NaN : value}
      {...props}
    />
  );
};

export default NumberField;
