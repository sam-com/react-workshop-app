"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadFiles = loadFiles;
var _path = _interopRequireDefault(require("path"));
var _fs = _interopRequireDefault(require("fs"));
var _glob = _interopRequireDefault(require("glob"));
function loadFiles({
  cwd = process.cwd(),
  ...rest
} = {}) {
  const fileInfo = _glob.default.sync('src/{exercise,final,examples}/**/*.+(js|html|jsx|ts|tsx|md|mdx)', {
    cwd,
    ...rest
  })
  // eslint-disable-next-line complexity
  .map(filePath => {
    var _name$match, _name$match2;
    const fullFilePath = _path.default.join(cwd, filePath);
    const {
      dir,
      name,
      ext
    } = _path.default.parse(fullFilePath);
    const parentDir = _path.default.basename(dir);
    const contents = String(_fs.default.readFileSync(fullFilePath));
    let type = parentDir;
    if (ext === '.md' || ext === '.mdx') {
      type = 'instruction';
    }
    const [firstLine, secondLine = ''] = contents.split(/\r?\n/);
    let title = 'Unknown';
    let extraCreditTitle = 'Unknown';
    const isExtraCredit = name.includes('.extra-');
    const fallbackMatch = {
      groups: {
        title: ''
      }
    };
    if (parentDir === 'final' || parentDir === 'exercise') {
      if (ext === '.js' || ext === '.tsx' || ext === '.ts') {
        var _firstLine$match, _titleMatch$groups$ti, _titleMatch$groups, _secondLine$match, _extraCreditTitleMatc, _extraCreditTitleMatc2;
        const titleMatch = (_firstLine$match = firstLine.match(/\/\/ (?<title>.*)$/)) != null ? _firstLine$match : fallbackMatch;
        title = (_titleMatch$groups$ti = (_titleMatch$groups = titleMatch.groups) == null ? void 0 : _titleMatch$groups.title.trim()) != null ? _titleMatch$groups$ti : title;
        const extraCreditTitleMatch = (_secondLine$match = secondLine.match(/\/\/ 💯 (?<title>.*)$/)) != null ? _secondLine$match : fallbackMatch;
        extraCreditTitle = (_extraCreditTitleMatc = (_extraCreditTitleMatc2 = extraCreditTitleMatch.groups) == null ? void 0 : _extraCreditTitleMatc2.title.trim()) != null ? _extraCreditTitleMatc : extraCreditTitle;
      } else if (ext === '.html') {
        var _firstLine$match2, _titleMatch$groups$ti2, _titleMatch$groups2, _secondLine$match2, _extraCreditTitleMatc3, _extraCreditTitleMatc4;
        const titleMatch = (_firstLine$match2 = firstLine.match(/<!-- (?<title>.*) -->/)) != null ? _firstLine$match2 : fallbackMatch;
        title = (_titleMatch$groups$ti2 = (_titleMatch$groups2 = titleMatch.groups) == null ? void 0 : _titleMatch$groups2.title.trim()) != null ? _titleMatch$groups$ti2 : title;
        const extraCreditTitleMatch = (_secondLine$match2 = secondLine.match(/<!-- 💯 (?<title>.*) -->/)) != null ? _secondLine$match2 : fallbackMatch;
        extraCreditTitle = (_extraCreditTitleMatc3 = (_extraCreditTitleMatc4 = extraCreditTitleMatch.groups) == null ? void 0 : _extraCreditTitleMatc4.title.trim()) != null ? _extraCreditTitleMatc3 : extraCreditTitle;
      } else if (ext === '.md' || ext === '.mdx') {
        var _firstLine$match3, _titleMatch$groups$ti3, _titleMatch$groups3;
        const titleMatch = (_firstLine$match3 = firstLine.match(/# (?<title>.*)$/)) != null ? _firstLine$match3 : fallbackMatch;
        title = (_titleMatch$groups$ti3 = (_titleMatch$groups3 = titleMatch.groups) == null ? void 0 : _titleMatch$groups3.title.trim()) != null ? _titleMatch$groups$ti3 : title;
      }
    }
    return {
      id: filePath,
      title,
      fullFilePath,
      filePath,
      isolatedPath: filePath.replace('src', '/isolated'),
      ext,
      filename: name,
      type,
      number: Number(((_name$match = name.match(/(^\d+)/)) != null ? _name$match : [null])[0]),
      isExtraCredit,
      extraCreditNumber: Number(((_name$match2 = name.match(/(\d+$)/)) != null ? _name$match2 : [null])[0]),
      extraCreditTitle
    };
  });
  fileInfo.sort((a, b) => {
    // change order so that shorter file names (01) are before longer (01.extra-01)
    if (a.filename.startsWith(b.filename)) return 1;
    if (b.filename.startsWith(a.filename)) return -1;
    // otherwise preserve order from glob (use explicit condition for consistency in Node 10)
    return a.id > b.id ? 1 : a.id < b.id ? -1 : 0;
  });
  return fileInfo;
}

// wrote the code before enabling the rule and didn't want to rewrite the code...
/*
eslint
  @typescript-eslint/prefer-regexp-exec: "off",
*/