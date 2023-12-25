import React from 'react';

import { FieldProps } from '../../Utilities/contracts';
import BaseFormField from './BaseFormField';

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
