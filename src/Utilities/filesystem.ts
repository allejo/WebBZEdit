export function defaultFilePickerOptions(): FilePickerOptions {
	return {
		types: [
			{
				description: 'BZFlag World File',
				accept: {
					'text/plain': ['.bzw'],
				},
			},
		],
	};
}

export function supportsFilesystemAPI(): boolean {
	return typeof window.showOpenFilePicker !== 'undefined';
}
