import React from 'react';

import BaseFormField, { FieldProps } from './BaseFormField';

const NumberField = (props: FieldProps<number>) => (
  <BaseFormField
    tag="input"
    type="number"
    startingValue={0}
    castStrToType={(s) => (s === null ? 0 : +s)}
    castTypeToStr={(s) => s + ''}
    {...props}
  />
);

export default NumberField;
