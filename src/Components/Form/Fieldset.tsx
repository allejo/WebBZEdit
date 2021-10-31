import React from 'react';
import { HTMLAttributes, ReactNode } from 'react';

import { classList } from '../../Utilities/cssClasses';

import styles from './Fieldset.module.scss';

interface Props extends HTMLAttributes<HTMLFieldSetElement> {
  legend: string;
  children: ReactNode;
}

const Fieldset = ({ children, className, legend, ...props }: Props) => (
  <fieldset className={classList([styles.wrapper, className])} {...props}>
    <legend className={styles.legend}>{legend}</legend>
    <div className={styles.body}>{children}</div>
  </fieldset>
);

export default Fieldset;
