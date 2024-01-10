/** @jsx jsx */
/** @jsxFrag React.Fragment */
import React from 'react';
import type { History } from 'history';
import type { FileInfo, LazyComponents } from './types';
declare function renderReactApp({ history, projectTitle, filesInfo, lazyComponents, gitHubRepoUrl, render, }: {
    history: History;
    projectTitle: string;
    filesInfo: Array<FileInfo>;
    lazyComponents: LazyComponents;
    gitHubRepoUrl: string;
    render: (ui: React.ReactElement) => void;
}): void;
export { renderReactApp };
