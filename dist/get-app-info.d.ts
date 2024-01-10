import type { FileInfo } from './types';
declare function getAppInfo({ cwd }?: {
    cwd?: string;
}): {
    gitHubRepoUrl: string;
    filesInfo: Array<FileInfo>;
    imports: Array<string>;
    hasBackend: boolean;
};
export { getAppInfo };
