"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Logo;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _core = require("@emotion/core");
var _emotionTheming = require("emotion-theming");
/** @jsx jsx */

function Logo(props) {
  var _props$size, _props$size2, _props$color, _props$color2, _props$strokeWidth;
  const theme = (0, _emotionTheming.useTheme)();
  return (0, _core.jsx)("svg", (0, _extends2.default)({
    id: "Layer_1",
    xmlns: "http://www.w3.org/2000/svg",
    width: (_props$size = props.size) != null ? _props$size : '34',
    height: (_props$size2 = props.size) != null ? _props$size2 : '34',
    x: "0px",
    y: "0px",
    viewBox: "0 0 97.362 97.362"
  }, props), (0, _core.jsx)("g", {
    fill: (_props$color = props.color) != null ? _props$color : theme.primary,
    stroke: (_props$color2 = props.color) != null ? _props$color2 : theme.primary,
    strokeWidth: (_props$strokeWidth = props.strokeWidth) != null ? _props$strokeWidth : 0
  }, (0, _core.jsx)("path", {
    d: "M48.681,0C21.795,0,0,21.795,0,48.681c0,26.886,21.795,48.681,48.681,48.681s48.681-21.795,48.681-48.681 C97.362,21.795,75.567,0,48.681,0z M38.347,86.1c-7.904-2.177-14.797-6.787-19.822-12.98c-0.342-0.474-0.683-0.954-1.023-1.441 c1.438-3.283,3.785-8.334,3.785-8.334c0.873,0.248,0.959,0.221,1.867,0.343c0.821,0.11,1.655,0.167,2.5,0.167 c1.842,0,2.971-0.09,4.686-0.596l10.359,18.345C40.699,81.604,39.147,84.588,38.347,86.1z M37.58,56.418l-0.127-0.217l5.448-9.975 c0,0,0.012,0.004,0.036,0.011c0.355,0.105,3.274,0.943,5.676,0.943c0.654,0,1.185-0.019,1.652-0.06 c0.467-0.042,0.869-0.106,1.263-0.197c0.789-0.183,1.55-0.475,2.743-0.91l5.756,10.414L48.739,74.925L37.58,56.418z M52.775,87.286 l13.553-24.193c1.966,0.559,2.466,0.415,4.57,0.415c2.161,0,3.023-0.277,5.039-0.864l4.343,8.576 C73.986,80.028,64.111,86.098,52.775,87.286z M74.476,39.137c-1.051-1.812-3.68-1.812-4.732,0l-4.852,8.381 c-0.002-0.029-0.002-0.05-0.008-0.087l-14.44-24.897c-0.769-1.325-2.692-1.324-3.461,0.002L32.046,47.962l-4.899-8.37 c-0.972-1.675-3.402-1.675-4.374,0L11.338,59.288c-0.956-3.373-1.479-6.928-1.479-10.607c0-21.44,17.381-38.821,38.822-38.821 s38.821,17.381,38.822,38.823c0,3.615-0.505,7.111-1.43,10.432L74.476,39.137z"
  })));
}