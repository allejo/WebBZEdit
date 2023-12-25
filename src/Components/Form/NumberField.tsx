import React, { KeyboardEvent, useState } from 'react';

import { FieldProps } from '../../Utilities/contracts';
import keyboard from '../../Utilities/keyboard';
import { safeValueInRange } from '../../Utilities/math';
import BaseFormField from './BaseFormField';

interface Props extends FieldProps<number> {
	minValue?: number;
	maxValue?: number;
	cycleValues?: boolean;
}

const NumberField = ({
	cycleValues = false,
	minValue,
	maxValue,
	onChange,
	value,
	...props
}: Props) => {
	const [inFocus, setInFocus] = useState(false);

	const hasLowerBound = () => minValue !== undefined;
	const hasUpperBound = () => maxValue !== undefined;
	const isFullRange = () => hasLowerBound() && hasUpperBound();

	const handleOnBlur = () => {
		setInFocus(false);

		if (isFullRange()) {
			const safeValue = safeValueInRange(value, minValue!, maxValue!);

			if (value !== safeValue) {
				onChange(safeValue);
			}
		} else if (hasLowerBound() && value < minValue!) {
			onChange(minValue!);
		} else if (hasUpperBound() && value > maxValue!) {
			onChange(maxValue!);
		}
	};
	const handleOnChange = (newValue: number) => {
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

			// We have a valid range of numbers
			if (cycleValues && isFullRange()) {
				newValue = safeValueInRange(newValue, minValue!, maxValue!);
			} else {
				if (hasLowerBound() && newValue < minValue!) {
					onChange(minValue!);
					return;
				}

				if (hasUpperBound() && newValue > maxValue!) {
					onChange(maxValue!);
					return;
				}
			}

			onChange(newValue);
		}
	};

	return (
		<BaseFormField<number>
			tag="input"
			type="number"
			castStrToType={(s) => (s === null || s === '' ? NaN : +s)}
			castTypeToStr={(v) => (isNaN(v) ? '' : String(v))}
			onChange={handleOnChange}
			onKeyDown={handleKeyPress}
			onBlur={handleOnBlur}
			value={inFocus ? NaN : value}
			{...props}
		/>
	);
};

export default NumberField;
