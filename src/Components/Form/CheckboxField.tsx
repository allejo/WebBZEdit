import React from 'react';

import { FieldProps } from '../../Utilities/contracts';
import BaseFormField from './BaseFormField';

const CheckboxField = (props: FieldProps<boolean>) => (
	<BaseFormField
		tag="input"
		type="checkbox"
		castStrToType={() => false}
		castTypeToStr={() => ''}
		{...props}
	/>
);

export default CheckboxField;
