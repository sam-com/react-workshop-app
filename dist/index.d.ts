import type { FileInfo, Imports, Backend } from './types';
declare function makeKCDWorkshopApp({ imports, filesInfo, projectTitle, backend, ...otherWorkshopOptions }: {
    imports: Imports;
    filesInfo: Array<FileInfo>;
    projectTitle: string;
    backend?: Backend;
    options?: {
        concurrentMode?: boolean;
    };
} & {
    gitHubRepoUrl: string;
}): void;
export { makeKCDWorkshopApp };
