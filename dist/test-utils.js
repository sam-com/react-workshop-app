"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alfredTip = alfredTip;
var _chalk = _interopRequireDefault(require("chalk"));
var _react = require("@testing-library/react");
function alfredTip(shouldThrow, tip, {
  displayEl
} = {}) {
  let caughtError;
  if (typeof shouldThrow === 'function') {
    try {
      shouldThrow = shouldThrow();
    } catch (e) {
      shouldThrow = true;
      caughtError = e;
    }
  }
  if (!shouldThrow) return;
  const tipString = typeof tip === 'function' ? tip(caughtError) : tip;
  const error = new Error(_chalk.default.red(`🚨 ${tipString}`));
  if (displayEl) {
    const el = typeof displayEl === 'function' ? displayEl(caughtError) : document.body;
    error.message += `\n\n${_chalk.default.reset((0, _react.prettyDOM)(el))}`;
  }
  // get rid of the stack to avoid the noisy codeframe
  error.stack = error.message;
  throw error;
}