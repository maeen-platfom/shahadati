// تعريفات مخصصة لـ react-dropzone لحل مشاكل التوافق

declare module 'react-dropzone' {
  import { ReactNode } from 'react';

  export interface FileRejection {
    file: File;
    errors: Array<{
      code: string;
      message: string;
    }>;
  }

  export interface Accept {
    [key: string]: string[];
  }

  export interface DropzoneOptions {
    onDrop?: (acceptedFiles: File[], rejectedFiles: FileRejection[]) => void;
    accept?: Accept;
    maxSize?: number;
    multiple?: boolean;
    disabled?: boolean;
    onDragEnter?: (event: React.DragEvent<HTMLElement>) => void;
    onDragOver?: (event: React.DragEvent<HTMLElement>) => void;
    onDragLeave?: (event: React.DragEvent<HTMLElement>) => void;
  }

  export interface DropzoneState {
    isDragActive: boolean;
    isDragAccept: boolean;
    isDragReject: boolean;
    isFocused: boolean;
    isFileDialogActive: boolean;
  }

  export interface DropzoneRootProps {
    refKey?: string;
    [key: string]: any;
  }

  export interface DropzoneInputProps {
    refKey?: string;
    type?: string;
    [key: string]: any;
  }

  export function useDropzone(options?: DropzoneOptions): {
    getRootProps: (props?: DropzoneRootProps) => DropzoneRootProps;
    getInputProps: (props?: DropzoneInputProps) => DropzoneInputProps;
    open: () => void;
    isDragActive: boolean;
    isDragAccept: boolean;
    isDragReject: boolean;
    isFocused: boolean;
  };
}
