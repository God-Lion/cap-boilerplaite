/**
 * File System Service
 * Wrapper for the File System Access API to read and write local files.
 */

// Types for File System Access API
type FileSystemHandleKind = 'file' | 'directory';

interface FileSystemHandle {
    readonly kind: FileSystemHandleKind;
    readonly name: string;
    isSameEntry(other: FileSystemHandle): Promise<boolean>;
}

interface FileSystemFileHandle extends FileSystemHandle {
    readonly kind: 'file';
    getFile(): Promise<File>;
    createWritable(options?: FileSystemCreateWritableOptions): Promise<FileSystemWritableFileStream>;
}

interface FileSystemDirectoryHandle extends FileSystemHandle {
    readonly kind: 'directory';
    getDirectoryHandle(name: string, options?: FileSystemGetDirectoryHandleOptions): Promise<FileSystemDirectoryHandle>;
    getFileHandle(name: string, options?: FileSystemGetFileHandleOptions): Promise<FileSystemFileHandle>;
    removeEntry(name: string, options?: FileSystemRemoveOptions): Promise<void>;
    resolve(possibleDescendant: FileSystemHandle): Promise<string[] | null>;
    [Symbol.asyncIterator](): AsyncIterableIterator<[string, FileSystemHandle]>;
    keys(): AsyncIterableIterator<string>;
    values(): AsyncIterableIterator<FileSystemHandle>;
    entries(): AsyncIterableIterator<[string, FileSystemHandle]>;
}

interface FileSystemCreateWritableOptions {
    keepExistingData?: boolean;
}

interface FileSystemWritableFileStream extends WritableStream {
    write(data: FileSystemWriteChunkType): Promise<void>;
    seek(position: number): Promise<void>;
    truncate(size: number): Promise<void>;
}

type FileSystemWriteChunkType = BufferSource | Blob | string | WriteParams;

interface WriteParams {
    type: 'write' | 'seek' | 'truncate';
    size?: number;
    position?: number;
    data?: BufferSource | Blob | string;
}

interface OpenFilePickerOptions {
    types?: FilePickerAcceptType[];
    excludeAcceptAllOption?: boolean;
    multiple?: boolean;
}

interface DirectoryPickerOptions {
    id?: string;
    startIn?: FileSystemHandle | WellKnownDirectory;
    mode?: 'read' | 'readwrite';
}

interface FilePickerAcceptType {
    description?: string;
    accept: Record<string, string[]>;
}

interface FileSystemGetFileHandleOptions {
    create?: boolean;
}

interface FileSystemGetDirectoryHandleOptions {
    create?: boolean;
}

interface FileSystemRemoveOptions {
    recursive?: boolean;
}

type WellKnownDirectory = 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos';

// Extend Window interface
declare global {
    interface Window {
        showOpenFilePicker(options?: OpenFilePickerOptions): Promise<FileSystemFileHandle[]>;
        showDirectoryPicker(options?: DirectoryPickerOptions): Promise<FileSystemDirectoryHandle>;
    }
}

export class FileSystemService {
    private static instance: FileSystemService

    private constructor() { }

    static getInstance(): FileSystemService {
        if (!FileSystemService.instance) {
            FileSystemService.instance = new FileSystemService()
        }
        return FileSystemService.instance
    }

    isSupported(): boolean {
        return 'showOpenFilePicker' in window
    }

    /**
     * Open a file picker and return the selected file handle(s)
     */
    async openFile(
        options?: OpenFilePickerOptions
    ): Promise<FileSystemFileHandle[]> {
        if (!this.isSupported()) {
            throw new Error('File System Access API is not supported.')
        }
        return window.showOpenFilePicker(options)
    }

    /**
     * Save content to a file handle
     */
    async saveFile(
        fileHandle: FileSystemFileHandle,
        content: FileSystemWriteChunkType
    ): Promise<void> {
        const writable = await fileHandle.createWritable()
        await writable.write(content)
        await writable.close()
    }

    /**
     * Open a directory picker
     */
    async openDirectory(
        options?: DirectoryPickerOptions
    ): Promise<FileSystemDirectoryHandle> {
        if (!this.isSupported()) {
            throw new Error('File System Access API is not supported.')
        }
        return window.showDirectoryPicker(options)
    }

    /**
     * Read text content from a file handle
     */
    async readFileContent(fileHandle: FileSystemFileHandle): Promise<string> {
        const file = await fileHandle.getFile()
        return file.text()
    }

    /**
     * Legacy fallback: Trigger a file download
     */
    downloadFile(filename: string, content: string | Blob, contentType: string = 'text/plain'): void {
        const element = document.createElement('a')
        const file = new Blob([content], { type: contentType })
        element.href = URL.createObjectURL(file)
        element.download = filename
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
    }
}

export const fileSystemService = FileSystemService.getInstance()
