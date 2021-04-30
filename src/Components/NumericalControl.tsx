import React, { SyntheticEvent } from 'react';

interface Props {
  label: string;
  onChange: (value: number) => void;
  prefix?: string;
  value: number;
}

const NumericalControl = ({ label, onChange, prefix, value }: Props) => {
  const id = [prefix, label].join('-').toLowerCase();
  const callback = (event: SyntheticEvent<HTMLInputElement>) => {
    onChange(+event.currentTarget.value);
  };

  return (
    <div>
      <label htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type="number"
        onChange={callback}
        value={value}
      />
    </div>
  );
}

export default NumericalControl;
