import React, { useMemo } from 'react';

import BaseFormField, { FieldProps } from './BaseFormField';

type KVPair = {
  key: string;
  val: string | KVPair[];
};

function createKeyValuePairs(options: Props['options']): KVPair[] {
  if (Array.isArray(options)) {
    return options.map((option) => ({
      key: option,
      val: option,
    }));
  }

  return Object.entries(options).map(([key, value]) => {
    return {
      key,
      val: typeof value === 'object' ? createKeyValuePairs(value) : value,
    };
  });
}

interface Props extends FieldProps<string> {
  disabledItems?: (number | string)[];
  formatValue?: (value: any) => string;
  options:
    | string[]
    | Record<number | string, string | string[] | Record<string, string>>;
}

const SelectField = ({
  disabledItems = [],
  formatValue,
  options: optionsRaw,
  ...props
}: Props) => {
  const options = useMemo(() => createKeyValuePairs(optionsRaw), [optionsRaw]);
  const isOptionDisabled = (pair: KVPair) =>
    pair.key.trim().length === 0 || disabledItems.indexOf(pair.key) > -1;

  const kvPairToJsx = (pair: KVPair) => {
    if (Array.isArray(pair.val)) {
      throw Error('Rendering a KVPair requires it to be simplified.');
    }

    return (
      <option key={pair.key} value={pair.key} disabled={isOptionDisabled(pair)}>
        {formatValue?.(pair.val) ?? pair.val}
      </option>
    );
  };

  return (
    <BaseFormField
      tag="select"
      castStrToType={(s) => s ?? ''}
      castTypeToStr={(s) => s}
      {...props}
    >
      {options.map((option, index) => {
        if (Array.isArray(option.val)) {
          return (
            <optgroup key={option.key + index} label={option.key}>
              {option.val.map(kvPairToJsx)}
            </optgroup>
          );
        }

        return kvPairToJsx(option);
      })}
    </BaseFormField>
  );
};

export default SelectField;
export type { Props as ISelectFieldProps };
