import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import FlagListEditor, { IFlagListEditorProps } from '../FlagListEditor';

function noop() {
	// no-op
}

describe('FlagListEditor Component', () => {
	it('should render with a no flags warning', () => {
		const { getByTestId } = render(
			<FlagListEditor allowCount={true} flags={[]} onChange={noop} />,
		);
		const emptyCanvas = getByTestId('empty-canvas');

		expect(emptyCanvas).toHaveTextContent('No flags defined');
	});

	it('should support adding a flag with a count and rendering it', () => {
		const props: IFlagListEditorProps = {
			allowCount: true,
			flags: [],
			onChange: (f) => (props.flags = f),
		};

		const { getByTestId, getAllByTestId, rerender } = render(
			<FlagListEditor {...props} />,
		);

		const flagPickerField = getByTestId('add-flag-sel');
		const flagCountField = getByTestId('add-flag-cnt');
		const flagAddButton = getByTestId('add-flag-btn');

		userEvent.selectOptions(flagPickerField, 'GM'); // Guided Missile
		userEvent.clear(flagCountField);
		userEvent.type(flagCountField, '5');
		userEvent.click(flagAddButton);

		rerender(<FlagListEditor {...props} />);

		const flagNames = getAllByTestId('curr-flag-name');
		const flagCounts = getAllByTestId('curr-flag-cnt');

		expect(flagNames).toHaveLength(1);
		expect(flagCounts).toHaveLength(1);
		expect(flagNames[0]).toHaveTextContent('Guided Missile');
		expect(flagCounts[0]).toHaveValue(5);
	});

	it('should support removing flags with counts', () => {
		const props: IFlagListEditorProps = {
			allowCount: true,
			flags: [
				['GM', 5],
				['G', 1],
			],
			onChange: (f) => (props.flags = f),
		};

		const { getAllByTestId, rerender } = render(<FlagListEditor {...props} />);

		const flagNames = getAllByTestId('curr-flag-name');
		const flagCounts = getAllByTestId('curr-flag-cnt');
		const flagButtons = getAllByTestId('curr-flag-btn');

		expect(flagNames).toHaveLength(2);
		expect(flagCounts).toHaveLength(2);

		const expected = ['Guided Missile', 'Genocide'];
		flagNames.forEach((el, i) => {
			expect(el.textContent).not.toBeNull();
			expect(el.textContent?.startsWith(expected[i])).toEqual(true);
		});

		userEvent.click(flagButtons[1]);
		expect(props.flags).toEqual([['GM', 5]]);

		rerender(<FlagListEditor {...props} />);

		userEvent.clear(flagCounts[0]);
		userEvent.type(flagCounts[0], '3');
		expect(props.flags).toEqual([['GM', 3]]);
	});
});
