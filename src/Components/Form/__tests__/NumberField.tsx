import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockConsole from 'jest-mock-console';
import React from 'react';

import NumberField from '../NumberField';

type NumberFieldProps = React.ComponentProps<typeof NumberField>;

type SetupProps = Omit<
  Partial<NumberFieldProps>,
  'label' | 'onChange' | 'value'
> & {
  initialValue?: number;
};

describe('NumberField Component', () => {
  const onChange = jest.fn();
  let restoreConsole: () => void;

  const renderField = ({ initialValue = 0, ...props }: SetupProps = {}) => {
    const Wrapper = () => {
      const [value, setValue] = React.useState(initialValue);

      return (
        <NumberField
          {...props}
          label="Amount"
          onChange={(newValue) => {
            onChange(newValue);
            setValue(newValue);
          }}
          value={value}
        />
      );
    };

    return render(<Wrapper />);
  };

  beforeEach(() => {
    onChange.mockReset();
    restoreConsole = mockConsole();
  });

  afterEach(() => {
    restoreConsole();
  });

  it('should render its label and initial value', () => {
    const { getByLabelText } = renderField({ initialValue: 42 });

    expect(getByLabelText('Amount')).toHaveValue(42);
  });

  it('should call `onChange` without clamping when a number is typed', () => {
    const { getByLabelText } = renderField({
      initialValue: NaN,
      minValue: 0,
      maxValue: 100,
    });
    const field = getByLabelText('Amount');

    userEvent.type(field, '150');

    expect(onChange).toHaveBeenLastCalledWith(150);
  });

  it('should clamp the value on change events coming from a spinner', () => {
    const { getByLabelText } = renderField({ minValue: 0, maxValue: 100 });
    const field = getByLabelText('Amount');

    fireEvent.change(field, { target: { value: '150' } });

    expect(onChange).toHaveBeenLastCalledWith(100);
  });

  it('should clamp the typed value on blur', () => {
    const { getByLabelText } = renderField({
      initialValue: NaN,
      minValue: 0,
      maxValue: 100,
    });
    const field = getByLabelText('Amount');

    userEvent.type(field, '150');
    fireEvent.blur(field);

    expect(onChange).toHaveBeenLastCalledWith(100);
  });

  it('should allow an empty value while editing without calling `onChange`', () => {
    const { getByLabelText } = renderField({
      minValue: 0,
      maxValue: 100,
      initialValue: 5,
    });
    const field = getByLabelText('Amount') as HTMLInputElement;

    userEvent.clear(field);

    expect(onChange).not.toHaveBeenCalled();
    expect(field.value).toEqual('');
  });

  it('should increment and decrement with the arrow keys', () => {
    const { getByLabelText } = renderField({ initialValue: 5 });
    const field = getByLabelText('Amount');

    fireEvent.keyDown(field, { key: 'ArrowUp' });
    expect(onChange).toHaveBeenLastCalledWith(6);

    fireEvent.keyDown(field, { key: 'ArrowDown' });
    expect(onChange).toHaveBeenLastCalledWith(5);
  });

  it('should change by 10 when the shift key is held', () => {
    const { getByLabelText } = renderField({ initialValue: 5 });
    const field = getByLabelText('Amount');

    fireEvent.keyDown(field, { key: 'ArrowUp', shiftKey: true });

    expect(onChange).toHaveBeenLastCalledWith(15);
  });

  it('should clamp arrow key changes at `maxValue`', () => {
    const { getByLabelText } = renderField({
      initialValue: 10,
      minValue: 0,
      maxValue: 10,
    });
    const field = getByLabelText('Amount');

    fireEvent.keyDown(field, { key: 'ArrowUp' });

    expect(onChange).toHaveBeenLastCalledWith(10);
  });

  it('should clamp arrow key changes at `minValue`', () => {
    const { getByLabelText } = renderField({
      initialValue: 0,
      minValue: 0,
      maxValue: 10,
    });
    const field = getByLabelText('Amount');

    fireEvent.keyDown(field, { key: 'ArrowDown' });

    expect(onChange).toHaveBeenLastCalledWith(0);
  });

  it('should cycle values past the upper bound when `cycleValues` is set', () => {
    const { getByLabelText } = renderField({
      initialValue: 359,
      minValue: 0,
      maxValue: 360,
      cycleValues: true,
      inclusive: false,
    });
    const field = getByLabelText('Amount');

    fireEvent.keyDown(field, { key: 'ArrowUp' });

    expect(onChange).toHaveBeenLastCalledWith(0);
  });

  it('should cycle values past the lower bound when `cycleValues` is set', () => {
    const { getByLabelText } = renderField({
      initialValue: 0,
      minValue: 0,
      maxValue: 360,
      cycleValues: true,
      inclusive: false,
    });
    const field = getByLabelText('Amount');

    fireEvent.keyDown(field, { key: 'ArrowDown' });

    expect(onChange).toHaveBeenLastCalledWith(359);
  });

  it('should keep the upper bound when cycling inclusively', () => {
    const { getByLabelText } = renderField({
      initialValue: 359,
      minValue: 1,
      maxValue: 360,
      cycleValues: true,
      inclusive: true,
    });
    const field = getByLabelText('Amount');

    fireEvent.keyDown(field, { key: 'ArrowUp' });

    expect(onChange).toHaveBeenLastCalledWith(360);
  });

  it('should cycle past the upper bound when cycling inclusively', () => {
    const { getByLabelText } = renderField({
      initialValue: 360,
      minValue: 1,
      maxValue: 360,
      cycleValues: true,
      inclusive: true,
    });
    const field = getByLabelText('Amount');

    fireEvent.keyDown(field, { key: 'ArrowUp' });

    expect(onChange).toHaveBeenLastCalledWith(1);
  });
});
