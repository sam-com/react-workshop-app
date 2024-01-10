import type { FileInfo } from './types';
declare function loadFiles({ cwd, ...rest }?: {
    cwd?: string | undefined;
}): Array<FileInfo>;
export { loadFiles };
