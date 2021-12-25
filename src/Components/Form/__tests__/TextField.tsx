import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import TextField from '../TextField';

describe('TextField Component', () => {
  it('should trigger `onChange` callback when user types', () => {
    let currentValue = '';

    const { getByLabelText } = render(
      <TextField
        label="Your Name"
        onChange={(data) => (currentValue = data)}
        value={currentValue}
      />,
    );
    const field = getByLabelText('Your Name') as HTMLInputElement;

    expect(field).toHaveValue('');
    expect(currentValue).toEqual('');

    const content = 'I am not log4j';
    userEvent.type(field, content);

    waitFor(() => expect(currentValue).toEqual(content));
  });

  it('should not let further changes when `allowChange` returns false', () => {
    let currentValue = '';

    const { getByLabelText } = render(
      <TextField
        label="Your Name"
        onChange={(data) => (currentValue = data)}
        allowChange={(data) => data.length <= 5}
        value=""
      />,
    );
    const field = getByLabelText('Your Name') as HTMLInputElement;

    expect(field).toHaveValue('');
    expect(currentValue).toEqual('');

    const content = 'I heart BZFlag';
    userEvent.type(field, content);

    waitFor(() => expect(currentValue).toEqual(content.substr(0, 5)));
  });
});
