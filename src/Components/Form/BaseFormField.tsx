import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {
  HTMLAttributes,
  HTMLProps,
  ReactNode,
  SyntheticEvent,
} from 'react';

import { classList } from '../../Utilities/cssClasses';
import { slugify } from '../../Utilities/slugify';
import { assumeType } from '../../Utilities/types';

import a11yStyles from '../../sass/a11yUtilities.module.scss';
import styles from './BaseFormField.module.scss';

type SupportedHTMLElements =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

export type ValueValidator<T> = (value: T) => boolean;

type BaseFieldProps = HTMLAttributes<HTMLInputElement>;
type Blacklist = 'onChange';

export enum FieldLayout {
  Stacked = 'default',
  Horizontal = 'horizontal',
}

export interface FieldProps<T> extends Omit<BaseFieldProps, Blacklist> {
  className?: string;
  disabled?: boolean;
  hideLabel?: boolean;
  layout?: FieldLayout;
  label: string;
  labelProps?: HTMLProps<HTMLLabelElement>;
  description?: string;
  allowChange?: ValueValidator<T>;
  onChange: (value: T) => void;
  value: T;
}

type InputProps = {
  tag: 'input';
  type: string;
};

type SelectProps = {
  tag: 'select';
  children: ReactNode;
};

type TextareaProps = {
  tag: 'textarea';
};

type Props<T> = {
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
} & (InputProps | SelectProps | TextareaProps);

const BaseFormField = <T,>({
  castStrToType,
  castTypeToStr,
  description = '',
  className,
  disabled,
  hideLabel = false,
  layout = FieldLayout.Stacked,
  label,
  labelProps = {},
  allowChange = () => true,
  onChange,
  tag,
  value,
  ...props
}: FieldProps<T> & Props<T>) => {
  const type = tag === 'input' ? (props as InputProps).type : tag;

  const elementId = labelProps.id ?? slugify(label);
  const isCheckbox = tag === 'input' && type === 'checkbox';

  const handleOnChange = (e: SyntheticEvent<SupportedHTMLElements>) => {
    let castedValue;

    if (isCheckbox) {
      assumeType<HTMLInputElement>(e.currentTarget);
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
  const standardProps: HTMLProps<SupportedHTMLElements> = {
    id: elementId,
    disabled: disabled,
    onChange: handleOnChange,
    'aria-invalid': false,
    'aria-describedby': helpDesc ? helpDescId : undefined,
    ...props,
  };

  if (isCheckbox) {
    standardProps['checked'] = (value as unknown) as boolean;
  } else {
    standardProps['value'] = castTypeToStr(value);
  }

  return (
    <div
      className={classList([styles.wrapper, className])}
      data-form-disabled={disabled}
      data-form-type={type || tag}
      data-layout={layout}
    >
      <label
        {...labelProps}
        htmlFor={elementId}
        className={classList([
          styles.label,
          labelProps?.className,
          [a11yStyles.srOnly, hideLabel],
        ])}
      >
        {label}
      </label>
      <div className={styles.fieldContainer}>
        {tag === 'input' && (
          <input
            {...(standardProps as HTMLProps<HTMLInputElement>)}
            className={styles.input}
            type={type}
          />
        )}
        {tag === 'select' && (
          <>
            <select
              {...(standardProps as HTMLProps<HTMLSelectElement>)}
              className={styles.selectField}
            >
              {(props as SelectProps).children}
            </select>
            <span className={styles.selectFieldArrow}>
              <FontAwesomeIcon icon={faCaretDown} fixedWidth={true} />
            </span>
          </>
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
