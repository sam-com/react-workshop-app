"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCode = getCode;
var _getAppInfo = require("./get-app-info");
// this generates the code to use in the entry file

function getCode({
  cwd = process.cwd()
} = {}) {
  const {
    gitHubRepoUrl,
    filesInfo,
    hasBackend,
    imports
  } = (0, _getAppInfo.getAppInfo)({
    cwd
  });
  return `
import {makeKCDWorkshopApp} from '@kentcdodds/react-workshop-app'
import {loadDevTools} from '@kentcdodds/react-workshop-app/dev-tools'
import pkg from '../package.json'
${hasBackend ? `import * as backend from './backend'` : ''}

if (module.hot) module.hot.accept()

const filesInfo = ${JSON.stringify(filesInfo, null, 2)}

loadDevTools(() => {
  makeKCDWorkshopApp({
    imports: {
      ${imports.join(',\n      ')}
    },
    filesInfo,
    projectTitle: pkg.title,
    gitHubRepoUrl: \`${gitHubRepoUrl}\`,
    ${hasBackend ? `backend,` : ''}
  })
})`.trim();
}