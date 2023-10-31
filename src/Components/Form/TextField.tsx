import React from 'react';

import BaseFormField, { FieldProps } from './BaseFormField';

const TextField = (props: FieldProps<string>) => (
	<BaseFormField
		tag="input"
		type="text"
		castStrToType={(s) => s ?? ''}
		castTypeToStr={(s) => s}
		{...props}
	/>
);

export default TextField;
