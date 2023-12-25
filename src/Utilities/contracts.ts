import { HTMLAttributes, HTMLProps, ReactNode } from 'react';

export enum AlertType {
	Info,
	Success,
	Warning,
	Danger,
}

export enum CardinalDirection {
	North,
	South,
	East,
	West,
}

export type SupportedFormElement =
	| HTMLInputElement
	| HTMLSelectElement
	| HTMLTextAreaElement;
export type ValueValidator<T> = (value: T) => boolean;
type BaseFieldProps = HTMLAttributes<HTMLInputElement>;
type Blacklist = 'onChange';

export enum FieldLayout {
	Stacked = 'default',
	Horizontal = 'horizontal',
}

export interface FieldProps<T> extends Omit<BaseFieldProps, Blacklist> {
	className?: string;
	disabled?: boolean;
	hideLabel?: boolean;
	layout?: FieldLayout;
	label: string;
	labelProps?: HTMLProps<HTMLLabelElement>;
	description?: string;
	allowChange?: ValueValidator<T>;
	onChange: (value: T) => void;
	value: T;
}

export type InputProps = {
	tag: 'input';
	type: string;
};
export type SelectProps = {
	tag: 'select';
	children: ReactNode;
};
export type TextareaProps = {
	tag: 'textarea';
};
export type Vector3F = [number, number, number];
export type Vector4F = [number, number, number, number];

/**
 * @link https://github.com/microsoft/TypeScript/issues/10421#issuecomment-518806979
 */
export function assumeType<T>(_: unknown): asserts _ is T {
	// ¯\_(ツ)_/¯
}

export const CAMERA_DEFAULT_POS: [number, number, number] = [-15, 15, 15];
