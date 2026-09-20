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

export type WritableFileSystemFileHandle = FileSystemFileHandle & {
  createWritable(): Promise<FileSystemWritableFileStream>;
};

export function supportsFilesystemAPI(): boolean {
  return typeof window.showOpenFilePicker !== 'undefined';
}
