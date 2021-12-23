import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import FlagListEditor, { IFlagListEditorProps } from '../FlagListEditor';

function noop() {}

describe('FlagListEditor Component', () => {
  it('should render with a no flags warning', () => {
    const { getByTestId } = render(
      <FlagListEditor allowCount={true} flags={[]} onChange={noop} />,
    );
    const emptyCanvas = getByTestId('empty-canvas');

    expect(emptyCanvas).toHaveTextContent('No flags defined');
  });

  it('should support adding a flag and rendering it', () => {
    let flags: IFlagListEditorProps['flags'] = [];
    const props: IFlagListEditorProps = {
      allowCount: true,
      flags: [],
      onChange: (f) => (flags = f),
    };

    const { getByTestId, getAllByTestId, rerender } = render(
      <FlagListEditor {...props} flags={flags} />,
    );

    const flagPickerField = getByTestId('add-flag-sel');
    const flagCountField = getByTestId('add-flag-cnt');
    const flagAddButton = getByTestId('add-flag-btn');

    userEvent.selectOptions(flagPickerField, 'GM'); // Guided Missile
    userEvent.type(flagCountField, '5');
    userEvent.click(flagAddButton);

    rerender(<FlagListEditor {...props} flags={flags} />);

    const flagNames = getAllByTestId('curr-flag-name');
    const flagCounts = getAllByTestId('curr-flag-cnt');

    expect(flagNames.length).toEqual(1);
    expect(flagCounts.length).toEqual(1);
    expect(flagNames[0]).toHaveTextContent('Guided Missile');
    expect(flagCounts[0]).toHaveValue(5);
  });
});
