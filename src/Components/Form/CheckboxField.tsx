import React from 'react';

import BaseFormField, { FieldProps } from './BaseFormField';

const CheckboxField = (props: FieldProps<boolean>) => (
	<BaseFormField
		tag="input"
		type="checkbox"
		castStrToType={(_) => false}
		castTypeToStr={(_) => ''}
		{...props}
	/>
);

export default CheckboxField;
