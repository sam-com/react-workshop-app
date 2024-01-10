"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAppInfo = getAppInfo;
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
var _loadFiles = require("./load-files");
// this utility helps to generate the code to use in the entry file

function getAppInfo({
  cwd = process.cwd()
} = {}) {
  const filesInfo = (0, _loadFiles.loadFiles)({
    cwd
  });
  let gitHubRepoUrl;
  const pkgPath = _path.default.join(process.cwd(), 'package.json');
  try {
    const {
      repository: {
        url: repoUrl
      }
    } = require(pkgPath);
    gitHubRepoUrl = repoUrl.replace('git+', '').replace('.git', '');
  } catch (error) {
    throw new Error(`Cannot find a repository URL for this workshop. Check that the package.json at "${pkgPath}" has {"repository": {"url": "this should be set to a github URL"}}`);
  }
  const imports = filesInfo.map(({
    id,
    filePath,
    ext
  }) => {
    let loaders = '';
    if (ext === '.html') {
      loaders = '!raw-loader!';
      // } else if (ext === '.md' || ext === '.mdx') {
      //   loaders = '!babel-loader!@mdx-js/loader!'
    }
    const relativePath = filePath.replace('src/', './');
    return `"${id}": () => import("${loaders}${relativePath}")`;
  });
  const hasBackend = _fs.default.existsSync(_path.default.join(cwd, 'src/backend.js')) || _fs.default.existsSync(_path.default.join(cwd, 'src/backend.ts')) || _fs.default.existsSync(_path.default.join(cwd, 'src/backend.tsx'));
  return {
    gitHubRepoUrl,
    filesInfo,
    imports,
    hasBackend
  };
}

/*
eslint
  @typescript-eslint/no-var-requires: "off",
*/