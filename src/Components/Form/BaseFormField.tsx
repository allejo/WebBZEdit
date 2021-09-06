import React, { FormEvent, HTMLProps } from 'react';

import { slugify } from '../../Utilities/slugify';

import styles from './BaseFormField.module.scss';

export type ValueValidator<T> = (value: T) => boolean;

export interface FieldProps<T> {
  label: string;
  labelProps?: HTMLProps<HTMLLabelElement>;
  description?: string;
  allowChange?: ValueValidator<T>;
  onChange: (value: T) => void;
  value: T;
}

interface Props<T> {
  tag: string;
  type: string;

  /**
   * This callback is used to cast a string value into `T` that is used for
   * the specific input type.
   *
   * Because all `<input>` elements handle their values as strings, we need to
   * define how to cast them into the appropriate values so they make sense
   * to use in our code. For example, a date input should return a casted `Date`
   * object.
   *
   * @param value
   *
   * @since 0.0.0
   */
  castStrToType: (value: string | null) => T;

  /**
   * This callback is used to cast an object of type T into a string that's
   * used for `<input>`s `value` attribute.
   *
   * Because all `<input>` elements handle their `value` attributes as string,
   * this callback defines how to convert from a complicated object into a
   * string. For example, an `InputDate` component should accept a `Date`
   * object but `<input>` would stringify that object into a format that
   * `<input type="date">` does not exist.
   *
   * @param value
   *
   * @since 0.0.0
   */
  castTypeToStr: (value: T) => string;
}

const BaseFormField = <T,>({
  castStrToType,
  castTypeToStr,
  description = '',
  label,
  labelProps = {},
  allowChange = () => true,
  onChange,
  tag,
  type,
  value,
}: FieldProps<T> & Props<T>) => {
  const elementId = labelProps.id ?? slugify(label);
  const isCheckbox = tag === 'input' && type === 'checkbox';

  const handleOnChange = (e: FormEvent<HTMLInputElement>) => {
    let castedValue;

    if (isCheckbox) {
      castedValue = e.currentTarget.checked;
    } else {
      castedValue = castStrToType(e.currentTarget.value);
    }

    const isValueAllowed = allowChange(castedValue as T);

    if (isValueAllowed) {
      onChange(castedValue as T);
    }
  };

  const helpDescRaw: string[] = [];
  const helpDescId: string = `${elementId}__helpDesc`;

  if (description) {
    helpDescRaw.push(description);
  }

  const helpDesc = helpDescRaw.join(' ');
  const standardProps: HTMLProps<HTMLInputElement> = {
    id: elementId,
    onChange: handleOnChange,
    'aria-invalid': false,
    'aria-describedby': helpDesc ? helpDescId : undefined,
  };

  if (isCheckbox) {
    standardProps['checked'] = (value as unknown) as boolean;
  } else {
    standardProps['value'] = castTypeToStr(value);
  }

  return (
    <div className={styles.wrapper} data-form-type={type || tag}>
      <label htmlFor={elementId} className={styles.label}>
        {label}
      </label>
      <div className={styles.fieldContainer}>
        {tag === 'input' && (
          <input {...standardProps} className={styles.input} type={type} />
        )}
      </div>
      {description && (
        <div id={helpDescId} className={styles.description}>
          {helpDescRaw.join(' ')}
        </div>
      )}
    </div>
  );
};

export default BaseFormField;
