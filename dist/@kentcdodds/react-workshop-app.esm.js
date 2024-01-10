import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserHistory } from 'history';
import { match } from 'node-match-path';
import 'msw';
import { jsx, Global } from '@emotion/core';
import facepaint from 'facepaint';
import { useTheme, ThemeProvider } from 'emotion-theming';
import { ErrorBoundary } from 'react-error-boundary';
import { Router, Switch, Route, useParams, Link } from 'react-router-dom';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@reach/tabs';
import { RiEdit2Fill, RiToolsLine, RiFlagLine, RiArrowLeftSLine, RiArrowRightSLine, RiMoonClearLine, RiSunLine, RiExternalLinkLine } from 'react-icons/ri';
import { CgDice1, CgDice2, CgDice3, CgDice4, CgDice5, CgDice6 } from 'react-icons/cg';
import { FaDiceD20 } from 'react-icons/fa';
import _extends from '@babel/runtime/helpers/esm/extends';

const getKey = name => `__react_workshop_app_${name}__`;
function getDefaultDelay() {
  const variableTime = ls(getKey('variable_request_time'), 400);
  const minTime = ls(getKey('min_request_time'), 400);
  return Math.random() * variableTime + minTime;
}
function sleep(t = getDefaultDelay()) {
  return new Promise(resolve => {
    if (process.env.NODE_ENV === 'test') {
      resolve();
    } else {
      setTimeout(resolve, t);
    }
  });
}
function ls(key, defaultVal) {
  const lsVal = window.localStorage.getItem(key);
  let val;
  if (lsVal) {
    val = Number(lsVal);
  }
  return typeof val !== 'undefined' && Number.isFinite(val) ? val : defaultVal;
}
const server = {};
function setup({
  handlers
}) {
  const enhancedHandlers = handlers.map(handler => {
    // @ts-expect-error it's protected but.....
    const originalResolver = handler.resolver;
    const enhancedResolver = async (req, res, ctx) => {
      try {
        if (shouldFail(req)) {
          throw new Error('Request failure (for testing purposes).');
        }
        const result = await originalResolver(req, res, ctx);
        return result;
      } catch (error) {
        // @ts-expect-error handling the error case... ugh...
        const status = error.status || 500;
        return await res(ctx.status(status),
        // @ts-expect-error res is expecting transformers<unknown>
        // and ctx.json is giving a specific one...
        ctx.json({
          status,
          message: error.message || 'Unknown Error'
        }));
      } finally {
        let delay;
        if (req.headers.has('delay')) {
          delay = Number(req.headers.get('delay'));
        }
        await sleep(delay);
      }
    };
    // @ts-expect-error not sure of a reasonable way to do this otherwise...
    handler.resolver = enhancedResolver;
    return handler;
  });
  if (process.env.NODE_ENV === 'test') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const {
      setupServer
    } = require('msw/node');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    Object.assign(server, setupServer(...enhancedHandlers));
    return server;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const {
      setupWorker
    } = require('msw');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    Object.assign(server, setupWorker(...enhancedHandlers));
    return server;
  }
}
function shouldFail(req) {
  var _req$body, _window$localStorage$;
  if (JSON.stringify((_req$body = req.body) != null ? _req$body : {}).includes('FAIL')) return true;
  if (req.url.searchParams.toString().includes('FAIL')) return true;
  const failureRate = Number((_window$localStorage$ = window.localStorage.getItem(getKey('failure_rate'))) != null ? _window$localStorage$ : 0);
  if (Math.random() < failureRate) return true;
  if (requestMatchesFailConfig(req)) return true;
  return false;
}
function requestMatchesFailConfig(req) {
  function configMatches({
    requestMethod,
    urlMatch
  }) {
    return (requestMethod === 'ALL' || req.method === requestMethod) && match(urlMatch, req.url.pathname).matches;
  }
  try {
    var _window$localStorage$2;
    const failConfig = JSON.parse((_window$localStorage$2 = window.localStorage.getItem(getKey('request_fail_config'))) != null ? _window$localStorage$2 : '[]');
    return failConfig.some(configMatches);
  } catch (error) {
    window.localStorage.removeItem(getKey('request_fail_config'));
  }
  return false;
}

/*
eslint
  @typescript-eslint/no-unsafe-assignment: "off",
*/

function Logo(props) {
  var _props$size, _props$size2, _props$color, _props$color2, _props$strokeWidth;
  const theme = useTheme();
  return jsx("svg", _extends({
    id: "Layer_1",
    xmlns: "http://www.w3.org/2000/svg",
    width: (_props$size = props.size) != null ? _props$size : '34',
    height: (_props$size2 = props.size) != null ? _props$size2 : '34',
    x: "0px",
    y: "0px",
    viewBox: "0 0 97.362 97.362"
  }, props), jsx("g", {
    fill: (_props$color = props.color) != null ? _props$color : theme.primary,
    stroke: (_props$color2 = props.color) != null ? _props$color2 : theme.primary,
    strokeWidth: (_props$strokeWidth = props.strokeWidth) != null ? _props$strokeWidth : 0
  }, jsx("path", {
    d: "M48.681,0C21.795,0,0,21.795,0,48.681c0,26.886,21.795,48.681,48.681,48.681s48.681-21.795,48.681-48.681 C97.362,21.795,75.567,0,48.681,0z M38.347,86.1c-7.904-2.177-14.797-6.787-19.822-12.98c-0.342-0.474-0.683-0.954-1.023-1.441 c1.438-3.283,3.785-8.334,3.785-8.334c0.873,0.248,0.959,0.221,1.867,0.343c0.821,0.11,1.655,0.167,2.5,0.167 c1.842,0,2.971-0.09,4.686-0.596l10.359,18.345C40.699,81.604,39.147,84.588,38.347,86.1z M37.58,56.418l-0.127-0.217l5.448-9.975 c0,0,0.012,0.004,0.036,0.011c0.355,0.105,3.274,0.943,5.676,0.943c0.654,0,1.185-0.019,1.652-0.06 c0.467-0.042,0.869-0.106,1.263-0.197c0.789-0.183,1.55-0.475,2.743-0.91l5.756,10.414L48.739,74.925L37.58,56.418z M52.775,87.286 l13.553-24.193c1.966,0.559,2.466,0.415,4.57,0.415c2.161,0,3.023-0.277,5.039-0.864l4.343,8.576 C73.986,80.028,64.111,86.098,52.775,87.286z M74.476,39.137c-1.051-1.812-3.68-1.812-4.732,0l-4.852,8.381 c-0.002-0.029-0.002-0.05-0.008-0.087l-14.44-24.897c-0.769-1.325-2.692-1.324-3.461,0.002L32.046,47.962l-4.899-8.37 c-0.972-1.675-3.402-1.675-4.374,0L11.338,59.288c-0.956-3.373-1.479-6.928-1.479-10.607c0-21.44,17.381-38.821,38.822-38.821 s38.821,17.381,38.822,38.823c0,3.615-0.505,7.111-1.43,10.432L74.476,39.137z"
  })));
}

const themeLight = {
  background: '#F4F6F8',
  backgroundLight: '#fff',
  text: '#212b36',
  textLightest: '#8E9EAC',
  primary: '#1675ff',
  sky: '#E9EDF1',
  skyLight: '#F4F6F8',
  skyDark: '#C4CDD5'
};
const themeDark = {
  background: '#19212a',
  backgroundLight: '#212b36',
  text: '#fff',
  textLightest: '#8E9EAC',
  primary: '#3587ff',
  sky: '#0D1217',
  skyLight: '#11181E',
  skyDark: '#8E9EAC'
};
const theme = mode => mode === 'dark' ? themeDark : themeLight;
const prismThemeLight = `
code[class*='language-'], pre[class*='language-'] {
  color: #403f53;
  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  word-wrap: normal;
  line-height: 1.5;

  -moz-tab-size: 4;
  -o-tab-size: 4;
  tab-size: 4;

  -webkit-hyphens: none;
  -moz-hyphens: none;
  -ms-hyphens: none;
  hyphens: none;
}

pre[class*='language-']::-moz-selection,
pre[class*='language-'] ::-moz-selection,
code[class*='language-']::-moz-selection,
code[class*='language-'] ::-moz-selection {
text-shadow: none;
background: rgba(22, 117, 255, 1);
}

pre[class*='language-']::selection,
pre[class*='language-'] ::selection,
code[class*='language-']::selection,
code[class*='language-'] ::selection {
text-shadow: none;
background: rgba(22, 117, 255, 1);
}

@media print {
code[class*='language-'],
pre[class*='language-'] {
  text-shadow: none;
}
}

/* Code blocks */
pre {
padding: 1em;
margin: 0.5em 0;
overflow: auto;
}

:not(pre) > code,
pre {
color: #403f53;
background: #f0f0f0;
}

:not(pre) > code {
padding: 0.1em;
border-radius: 0.3em;
white-space: normal;
}

.token.comment,
.token.prolog,
.token.cdata {
color: rgb(152, 159, 177);
font-style: italic;
}

.token.punctuation {
color: rgb(153, 76, 195);
}

.namespace {
color: rgb(12, 150, 155);
}

.token.deleted {
color: rgba(64, 63, 83, 0.56);
font-style: italic;
}

.token.symbol,
.token.property {
color: rgb(153, 76, 195);
}

.token.tag,
.token.operator,
.token.keyword {
color: #994cc3;
}

.token.boolean {
color: rgb(188, 84, 84);
}

.token.number {
color: rgb(170, 9, 130);
}

.token.constant,
.token.function,
.token.builtin,
.token.char {
color: rgb(72, 118, 214);
}

.token.selector,
.token.doctype {
color: rgb(153, 76, 195);
font-style: italic;
}

.token.attr-name,
.token.inserted {
color: rgb(72, 117, 214);
font-style: italic;
}

.token.string,
.token.url,
.token.entity,
.language-css .token.string,
.style .token.string {
color: #c96765;
}

.token.class-name,
.token.atrule,
.token.attr-value {
color: #c96765;
}

.token.regex,
.token.important,
.token.variable {
color: rgb(64, 63, 83);
}

.token.important,
.token.bold {
font-weight: bold;
}

.token.italic {
font-style: italic;
}
`;
const prismThemeDark = `
code[class*='language-'],
pre[class*='language-'] {
  color: #d6deeb;
  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  word-wrap: normal;
  line-height: 1.5;

  -moz-tab-size: 4;
  -o-tab-size: 4;
  tab-size: 4;

  -webkit-hyphens: none;
  -moz-hyphens: none;
  -ms-hyphens: none;
  hyphens: none;
}

pre[class*='language-']::-moz-selection,
pre[class*='language-'] ::-moz-selection,
code[class*='language-']::-moz-selection,
code[class*='language-'] ::-moz-selection {
  text-shadow: none;
  background: rgba(29, 59, 83, 0.99);
}

pre[class*='language-']::selection,
pre[class*='language-'] ::selection,
code[class*='language-']::selection,
code[class*='language-'] ::selection {
  text-shadow: none;
  background: rgba(29, 59, 83, 0.99);
}

@media print {
  code[class*='language-'],
  pre[class*='language-'] {
    text-shadow: none;
  }
}

/* Code blocks */
pre {
  padding: 1em;
  margin: 0.5em 0;
  overflow: auto;
}

:not(pre) > code,
pre {
  color: white;
  background: #011627;
}

:not(pre) > code {
  padding: 0.1em;
  border-radius: 0.3em;
  white-space: normal;
}

.token.comment,
.token.prolog,
.token.cdata {
  color: rgb(99, 119, 119);
  font-style: italic;
}

.token.punctuation {
  color: rgb(199, 146, 234);
}

.namespace {
  color: rgb(178, 204, 214);
}

.token.deleted {
  color: rgba(239, 83, 80, 0.56);
  font-style: italic;
}

.token.symbol,
.token.property {
  color: rgb(128, 203, 196);
}

.token.tag,
.token.operator,
.token.keyword {
  color: rgb(127, 219, 202);
}

.token.boolean {
  color: rgb(255, 88, 116);
}

.token.number {
  color: rgb(247, 140, 108);
}

.token.constant,
.token.function,
.token.builtin,
.token.char {
  color: rgb(130, 170, 255);
}

.token.selector,
.token.doctype {
  color: rgb(199, 146, 234);
  font-style: italic;
}

.token.attr-name,
.token.inserted {
  color: rgb(173, 219, 103);
  font-style: italic;
}

.token.string,
.token.url,
.token.entity,
.language-css .token.string,
.style .token.string {
  color: rgb(173, 219, 103);
}

.token.class-name,
.token.atrule,
.token.attr-value {
  color: rgb(255, 203, 139);
}

.token.regex,
.token.important,
.token.variable {
  color: rgb(214, 222, 235);
}

.token.important,
.token.bold {
  font-weight: bold;
}

.token.italic {
  font-style: italic;
}
`;

/** @jsx jsx */
const styleTag$1 = document.createElement('style');
styleTag$1.innerHTML = [":root{--reach-tabs:1}[data-reach-tabs][data-orientation=vertical]{display:flex}[data-reach-tab-list]{display:flex;background:rgba(0,0,0,.05)}[data-reach-tab-list][aria-orientation=vertical]{flex-direction:column}[data-reach-tab]{display:inline-block;padding:.25em .5em;margin:0;border:none;border-bottom:1px solid transparent;background:none;color:inherit;font:inherit;cursor:pointer;-webkit-appearance:none;-moz-appearance:none}[data-reach-tab]:active{background:rgba(0,0,0,.05)}[data-reach-tab]:disabled{opacity:.25;cursor:default}[data-reach-tab][data-selected]{border-bottom-color:initial}"].join('\n');
document.head.prepend(styleTag$1);
const extrIcons = [null, CgDice1, CgDice2, CgDice3, CgDice4, CgDice5, CgDice6];
const getDiceIcon = number => {
  var _extrIcons$number;
  return (_extrIcons$number = extrIcons[number]) != null ? _extrIcons$number : FaDiceD20;
};
function getDistanceFromTopOfPage(element) {
  let distance = 0;
  while (element) {
    distance += element.offsetTop - element.scrollTop + element.clientTop;
    element = element.offsetParent;
  }
  return distance;
}
const totallyCenteredStyles = {
  minWidth: '100%',
  minHeight: '100%',
  display: 'grid'
};
const visuallyHiddenStyles = {
  border: '0',
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: '0',
  position: 'absolute',
  width: '1px'
};
const exerciseTypes = ['final', 'exercise', 'instruction'];
const isExerciseType = type =>
// .includes *should* allow you to pass any type, but it does not :-(
exerciseTypes.includes(type);
function renderReactApp({
  history,
  projectTitle,
  filesInfo,
  lazyComponents,
  gitHubRepoUrl,
  render
}) {
  const useTheme$1 = () => useTheme();
  const exerciseInfo = [];
  for (const fileInfo of filesInfo) {
    const type = fileInfo.type;
    if (isExerciseType(type)) {
      var _exerciseInfo$fileInf;
      exerciseInfo[fileInfo.number] = (_exerciseInfo$fileInf = exerciseInfo[fileInfo.number]) != null ? _exerciseInfo$fileInf : {
        exercise: [],
        final: []
      };
      const info = exerciseInfo[fileInfo.number];
      if (type === 'instruction') {
        info.instruction = fileInfo;
        const {
          title,
          number,
          id
        } = fileInfo;
        Object.assign(info, {
          title,
          number,
          id
        });
      } else {
        info[type].push(fileInfo);
      }
    }
  }
  for (const info of exerciseInfo.filter(Boolean)) {
    info.next = exerciseInfo[info.number + 1];
    info.previous = exerciseInfo[info.number - 1];
  }
  const mq = facepaint(['@media(min-width: 576px)', '@media(min-width: 768px)', '@media(min-width: 992px)', '@media(min-width: 1200px)']);
  const tabStyles = ({
    theme
  }) => ({
    background: theme.backgroundLight,
    borderTop: `1px solid ${theme.sky}`,
    height: '100%',
    position: 'relative',
    zIndex: 10,
    '[data-reach-tab]': {
      padding: '0.5rem 1.25rem',
      ':hover': {
        color: theme.primary
      }
    },
    '[data-reach-tab][data-selected]': {
      background: theme.backgroundLight,
      border: 'none',
      svg: {
        fill: theme.primary,
        color: theme.primary
      },
      ':hover': {
        color: 'inherit'
      }
    }
  });
  function FileTabs({
    isOpen,
    files
  }) {
    const theme = useTheme$1();
    const [tabIndex, setTabIndex] = React.useState(0);
    const renderedTabs = React.useRef();
    if (!renderedTabs.current) {
      renderedTabs.current = new Set([0]);
    }
    function handleTabChange(index) {
      var _renderedTabs$current;
      setTabIndex(index);
      (_renderedTabs$current = renderedTabs.current) == null || _renderedTabs$current.add(index);
    }
    if (files.length == 1) {
      const {
        title,
        extraCreditTitle,
        isolatedPath
      } = files[0];
      return jsx(Sandbox, {
        isOpen: isOpen,
        isolatedPath: isolatedPath,
        isolatedPathLinkContent: "Open on isolated page",
        title: extraCreditTitle != null ? extraCreditTitle : title
      }, renderedTabs.current.has(0) ? jsx("iframe", {
        title: extraCreditTitle != null ? extraCreditTitle : title,
        src: isolatedPath,
        css: {
          border: 'none',
          width: '100%',
          height: '100%'
        }
      }) : null);
    }
    return isOpen ? jsx(Tabs, {
      index: tabIndex,
      onChange: handleTabChange,
      css: tabStyles({
        theme
      })
    }, jsx(TabList, {
      css: {
        height: 50,
        background: theme.skyLight,
        overflowX: 'auto',
        whiteSpace: 'nowrap'
      }
    }, files.map(({
      id,
      filename,
      extraCreditNumber = -1,
      isExtraCredit,
      type
    }) => jsx(Tab, {
      key: id,
      css: {
        display: 'flex',
        alignItems: 'center'
      }
    }, isExtraCredit ? jsx(React.Fragment, null, /*#__PURE__*/React.createElement(getDiceIcon(extraCreditNumber), {
      size: 20,
      style: {
        marginRight: 5
      }
    }), jsx("span", null, "Extra Credit")) : type === 'final' ? 'Solution' : type === 'exercise' ? 'Exercise' : filename))), jsx(TabPanels, null, files.map(({
      title,
      extraCreditTitle,
      isolatedPath,
      id
    }, index) => {
      var _renderedTabs$current2;
      return jsx(TabPanel, {
        key: id
      }, jsx(Sandbox, {
        isOpen: tabIndex === index,
        isolatedPath: isolatedPath,
        isolatedPathLinkContent: "Open on isolated page",
        title: extraCreditTitle != null ? extraCreditTitle : title
      }, (_renderedTabs$current2 = renderedTabs.current) != null && _renderedTabs$current2.has(0) ? jsx("iframe", {
        title: extraCreditTitle != null ? extraCreditTitle : title,
        src: isolatedPath,
        css: {
          border: 'none',
          width: '100%',
          height: '100%'
        }
      }) : null));
    }))) : null;
  }
  FileTabs.displayName = 'FileTabs';
  function Sandbox({
    isOpen,
    isolatedPath,
    isolatedPathLinkContent,
    title,
    children
  }) {
    const renderContainerRef = React.useRef(null);
    const [height, setHeight] = React.useState(0);
    React.useLayoutEffect(() => {
      if (isOpen) {
        setHeight(getDistanceFromTopOfPage(renderContainerRef.current));
      }
    }, [isOpen]);
    return jsx(React.Fragment, null, jsx("div", {
      css: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        padding: '1rem'
      }
    }, jsx("div", null, title), jsx("a", {
      css: {
        display: 'flex',
        justifyContent: 'flex-end',
        textDecoration: 'none'
      },
      href: isolatedPath,
      target: "_blank",
      rel: "noreferrer"
    }, jsx(RiExternalLinkLine, {
      css: {
        marginRight: '0.25rem'
      }
    }), ' ', isolatedPathLinkContent)), jsx("div", {
      ref: renderContainerRef,
      css: [totallyCenteredStyles, mq({
        color: '#19212a',
        background: 'white',
        minHeight: 500,
        height: ['auto', 'auto', `calc(100vh - ${height}px)`],
        overflowY: ['auto', 'auto', 'scroll']
      })]
    }, jsx("div", {
      className: "final-container render-container"
    }, children)));
  }
  Sandbox.displayName = 'Sandbox';
  function ExerciseContainer(props) {
    const theme = useTheme$1();
    const {
      exerciseNumber: exerciseNumberString
    } = useParams();
    const exerciseNumber = Number(exerciseNumberString);
    const [tabIndex, setTabIndex] = React.useState(0);
    const renderedTabs = React.useRef();
    if (!renderedTabs.current) {
      renderedTabs.current = new Set([0]);
    }
    function handleTabChange(index) {
      var _renderedTabs$current3;
      setTabIndex(index);
      (_renderedTabs$current3 = renderedTabs.current) == null || _renderedTabs$current3.add(index);
    }

    // allow the user to continue to the next exercise with the left/right keys
    React.useEffect(() => {
      const handleKeyup = e => {
        if (e.target !== document.body) return;
        if (e.key === 'ArrowRight') {
          const {
            number
          } = exerciseInfo[exerciseNumber + 1] || exerciseInfo[1];
          history.push(`/${number}`);
        } else if (e.key === 'ArrowLeft') {
          const {
            number
          } = exerciseInfo[exerciseNumber - 1] || exerciseInfo[exerciseInfo.length - 1];
          history.push(`/${number}`);
        }
      };
      document.body.addEventListener('keyup', handleKeyup);
      return () => document.body.removeEventListener('keyup', handleKeyup);
    }, [exerciseNumber]);
    if (isNaN(exerciseNumber) || !exerciseInfo[exerciseNumber]) {
      return jsx(NotFound, null);
    }
    const {
      instruction,
      exercise,
      final
    } = exerciseInfo[exerciseNumber];
    let instructionElement;
    const comp = lazyComponents[instruction.id];
    if (comp) {
      instructionElement = /*#__PURE__*/React.createElement(comp);
    }
    return jsx(React.Fragment, null, jsx(Navigation, {
      exerciseNumber: exerciseNumber,
      mode: props.mode,
      setMode: props.setMode
    }), jsx("div", {
      css: {
        minHeight: 'calc(100vh - 60px)'
      }
    }, jsx("div", {
      css: mq({
        display: 'grid',
        gridTemplateColumns: ['100%', '100%', '50% 50%'],
        gridTemplateRows: 'auto'
      })
    }, jsx("div", {
      css: mq({
        position: 'relative',
        gridRow: [2, 2, 'auto'],
        height: ['auto', 'auto', 'calc(100vh - 60px)'],
        overflowY: ['auto', 'auto', 'scroll'],
        padding: '1rem 2rem 3rem 2rem',
        borderTop: `1px solid ${theme.sky}`,
        '::-webkit-scrollbar': {
          background: theme.skyLight,
          borderLeft: `1px solid ${theme.sky}`,
          borderRight: `1px solid ${theme.sky}`,
          width: 10
        },
        '::-webkit-scrollbar-thumb': {
          background: theme.skyDark
        },
        'p, li': {
          fontSize: 18,
          lineHeight: 1.5
        },
        blockquote: {
          borderLeft: `2px solid ${theme.primary}`,
          margin: 0,
          paddingLeft: '1.5rem'
        },
        pre: {
          background: theme.sky,
          fontSize: '80%',
          margin: '0 -2rem',
          padding: '2rem'
        },
        ul: {
          padding: 0,
          listStylePosition: 'inside'
        },
        'ul ul': {
          paddingLeft: '2rem'
        },
        'p > code': {
          background: theme.sky,
          color: theme.text,
          fontSize: '85%',
          padding: '3px 5px'
        }
      })
    }, jsx(React.Suspense, {
      fallback: jsx("div", {
        css: totallyCenteredStyles
      }, "Loading...")
    }, jsx("div", {
      css: {
        position: 'absolute',
        top: 20,
        right: 20,
        fontSize: '1.2rem',
        color: theme.textLightest
      }
    }, jsx("a", {
      href: `${gitHubRepoUrl}/edit/main/${instruction.filePath}`,
      title: "edit docs (in the original repo, e.g. to fix typos)",
      target: "_blank",
      rel: "noopener noreferrer nofollow"
    }, jsx("span", {
      "aria-label": "edit"
    }, jsx(RiEdit2Fill, null)))), jsx("div", {
      className: "instruction-container"
    }, instructionElement))), jsx("div", {
      css: {
        background: theme.background
      }
    }, jsx(Tabs, {
      index: tabIndex,
      onChange: handleTabChange,
      css: tabStyles({
        theme
      })
    }, jsx(TabList, {
      css: {
        height: 50,
        background: theme.skyLight
      }
    }, jsx(Tab, {
      css: {
        display: 'flex',
        alignItems: 'center'
      }
    }, jsx(RiToolsLine, {
      size: "20",
      color: theme.textLightest,
      css: {
        marginRight: 5
      }
    }), jsx("span", null, "Exercise ", exerciseNumber)), jsx(Tab, {
      css: {
        display: 'flex',
        alignItems: 'center'
      }
    }, jsx(RiFlagLine, {
      size: "18",
      color: theme.textLightest,
      css: {
        marginRight: 5
      }
    }), "Final")), jsx(TabPanels, null, jsx(TabPanel, null, jsx(FileTabs, {
      key: exerciseNumber,
      isOpen: tabIndex === 0,
      files: exercise
    })), jsx(TabPanel, null, jsx(FileTabs, {
      key: exerciseNumber,
      isOpen: tabIndex === 1,
      files: final
    }))))))));
  }
  ExerciseContainer.displayName = 'ExerciseContainer';
  function Navigation({
    exerciseNumber,
    mode,
    setMode
  }) {
    const theme = useTheme$1();
    const info = exerciseNumber ? exerciseInfo[exerciseNumber] : null;
    return jsx("div", {
      css: mq({
        a: {
          textDecoration: 'none'
        },
        alignItems: 'center',
        background: theme.backgroundLight,
        boxShadow: '0 0.9px 1.5px -18px rgba(0, 0, 0, 0.024), 0 2.4px 4.1px -18px rgba(0, 0, 0, 0.035), 0 5.7px 9.9px -18px rgba(0, 0, 0, 0.046), 0 19px 33px -18px rgba(0, 0, 0, 0.07)',
        display: 'grid',
        gridTemplateColumns: exerciseNumber ? ['3fr .5fr', '1fr 2fr', '1fr 1fr'] : '1fr 1fr',
        height: 60,
        padding: ['0 1rem', '0 1.75rem'],
        width: '100%',
        'span[role="img"]': {
          fontSize: [24, 24, 'inherit']
        },
        '.exercise-title': {
          color: theme.text,
          display: ['none', 'inline-block', 'inline-block'],
          fontSize: 15,
          opacity: 0.9,
          ':hover': {
            opacity: 1
          }
        }
      })
    }, jsx("div", {
      css: {
        display: 'flex',
        alignItems: 'center'
      }
    }, jsx(Link, {
      to: "/",
      css: {
        display: 'flex',
        alignItems: 'center',
        color: 'inherit'
      }
    }, jsx(Logo, {
      css: {
        marginRight: '.5rem'
      },
      strokeWidth: 0.8
    }), jsx("div", {
      css: {
        display: 'flex',
        flexDirection: 'column'
      }
    }, jsx("h1", {
      css: {
        fontSize: 16,
        margin: 0
      }
    }, projectTitle), jsx("span", {
      css: {
        fontSize: 14,
        opacity: '.8'
      }
    }, "Epic Classcraft")))), jsx("div", {
      css: {
        alignItems: 'center',
        display: 'grid',
        gridTemplateColumns: exerciseNumber ? '3fr 2fr 3fr 3rem' : '1fr',
        paddingLeft: '1rem',
        width: '100%'
      }
    }, info ? jsx(React.Fragment, null, jsx("div", null, info.previous ? jsx(Link, {
      to: `/${info.previous.number}`,
      css: {
        display: 'flex',
        alignItems: 'center'
      }
    }, jsx(RiArrowLeftSLine, {
      size: 20
    }), jsx("span", {
      className: "exercise-title"
    }, info.previous.title)) : null), jsx("div", {
      css: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, exerciseInfo.map(e => jsx(React.Fragment, {
      key: e.id
    }, jsx("input", {
      id: `exercise-dot-${e.id}`,
      type: "radio",
      name: "exercise-dots",
      checked: e.id === info.id,
      onChange: () => history.push(`/${e.number}`),
      css: visuallyHiddenStyles
    }), jsx("label", {
      htmlFor: `exercise-dot-${e.id}`,
      title: e.title
    }, jsx("span", {
      css: visuallyHiddenStyles
    }, e.title), jsx("span", {
      css: {
        cursor: 'pointer',
        display: 'block',
        background: e.id === info.id ? theme.primary : theme.skyDark,
        borderRadius: '50%',
        height: 12,
        width: 12,
        margin: '0 6px'
      }
    }))))), jsx("div", {
      css: {
        textAlign: 'right'
      }
    }, info.next ? jsx(Link, {
      to: `/${info.next.number}`,
      css: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'flex-end'
      }
    }, jsx("span", {
      className: "exercise-title"
    }, info.next.title), ' ', jsx(RiArrowRightSLine, {
      size: 20
    })) : null)) : null, jsx("div", {
      css: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
      }
    }, jsx("button", {
      css: {
        cursor: 'pointer',
        border: 'none',
        background: 'transparent',
        color: theme.text,
        textAlign: 'right'
      },
      onClick: () => setMode(mode === 'light' ? 'dark' : 'light')
    }, mode === 'light' ? jsx(RiMoonClearLine, {
      size: "1.25rem",
      color: "currentColor"
    }) : jsx(RiSunLine, {
      size: "1.25rem",
      color: "currentColor"
    })))));
  }
  Navigation.displayName = 'Navigation';
  function Home(props) {
    const theme = useTheme$1();
    return jsx(React.Fragment, null, jsx(Navigation, {
      mode: props.mode,
      setMode: props.setMode
    }), jsx("div", {
      css: mq({
        width: '100%',
        maxWidth: 800,
        minHeight: '85vh',
        margin: '0 auto',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      })
    }, jsx(Logo, {
      size: 120,
      color: theme.skyDark,
      strokeWidth: 0.7,
      css: mq({
        opacity: 0.5,
        marginTop: ['3rem', 0]
      })
    }), jsx("h1", {
      css: mq({
        textAlign: 'center',
        marginBottom: ['4rem', '4rem'],
        marginTop: '3rem'
      })
    }, projectTitle), jsx("div", {
      css: mq({
        width: '100%',
        display: 'grid',
        gridTemplateColumns: ['auto', 'auto'],
        gridGap: '1rem'
      })
    }, exerciseInfo.filter(Boolean).map(({
      id,
      number,
      title,
      final,
      exercise
    }) => {
      return jsx("div", {
        key: id,
        css: mq({
          alignItems: 'center',
          background: theme.backgroundLight,
          borderRadius: 5,
          boxShadow: '0 0px 1.7px -7px rgba(0, 0, 0, 0.02), 0 0px 4px -7px rgba(0, 0, 0, 0.028), 0 0px 7.5px -7px rgba(0, 0, 0, 0.035), 0 0px 13.4px -7px rgba(0, 0, 0, 0.042), 0 0px 25.1px -7px rgba(0, 0, 0, 0.05), 0 0px 60px -7px rgba(0, 0, 0, 0.07)',
          display: 'grid',
          fontSize: '18px',
          gridTemplateColumns: ['auto', '60% 40%'],
          position: 'relative',
          ':hover': {
            background: theme.skyLight,
            small: {
              opacity: 1
            },
            '::before': {
              background: theme.primary,
              border: `2px solid ${theme.primary}`,
              color: theme.background
            }
          },
          '::before': {
            alignItems: 'center',
            background: theme.backgroundLight,
            border: `2px solid ${theme.skyDark}`,
            borderRadius: 12,
            color: theme.textLightest,
            content: `"${number}"`,
            display: ['none', 'flex'],
            fontSize: 12,
            fontWeight: 600,
            height: 24,
            justifyContent: 'center',
            marginLeft: 23,
            marginTop: 0,
            paddingTop: 1,
            paddingLeft: 1,
            position: 'absolute',
            textAlign: 'center',
            width: 24,
            zIndex: 1
          },
          '::after': {
            content: '""',
            position: 'absolute',
            display: ['none', 'block'],
            width: 2,
            height: 'calc(100% + 1rem)',
            background: theme.skyDark,
            marginLeft: 34
          },
          ':first-of-type': {
            '::after': {
              content: '""',
              position: 'absolute',
              display: ['none', 'block'],
              width: 2,
              height: 'calc(50% + 1rem)',
              background: theme.skyDark,
              marginLeft: 34,
              marginTop: '4rem'
            }
          },
          ':last-of-type': {
            '::after': {
              content: '""',
              position: 'absolute',
              display: ['none', 'block'],
              width: 2,
              height: 'calc(50% + 1rem)',
              background: theme.skyDark,
              marginLeft: 34,
              marginBottom: '4rem'
            }
          }
        })
      }, jsx(Link, {
        to: `/${number}`,
        css: mq({
          padding: ['2rem 2rem 0 2rem', '2rem 2.5rem 2rem 2rem'],
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          color: 'inherit',
          ':hover': {
            h3: {
              textDecoration: 'underline',
              textDecorationColor: 'rgba(0,0,0,0.3)'
            }
          }
        })
      }, jsx("small", {
        css: mq({
          display: ['block', 'none'],
          opacity: 0.7,
          fontSize: 14
        })
      }, number), jsx("h3", {
        css: mq({
          fontSize: [24, 20],
          fontWeight: [600, 500],
          margin: 0,
          marginLeft: ['1rem', '2rem']
        })
      }, title)), jsx("div", {
        css: mq({
          width: '100%',
          display: 'flex',
          flexDirection: ['column', 'row'],
          height: ['auto', 48],
          padding: ['1.5rem 1rem', '8px 15px'],
          alignItems: 'center'
        })
      }, jsx("a", {
        href: exercise[0].isolatedPath,
        title: "exercise",
        css: mq({
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: ['flex-start', 'center'],
          color: 'inherit',
          padding: ['.7rem 1rem', 0],
          fontSize: 16,
          height: [48, 56],
          textDecoration: 'none',
          borderRadius: 5,
          ':hover': {
            background: theme.backgroundLight,
            svg: {
              fill: theme.primary
            }
          }
        })
      }, jsx(RiToolsLine, {
        size: "20",
        color: theme.textLightest,
        css: {
          marginRight: 5
        }
      }), jsx("span", null, "Exercise")), jsx("a", {
        href: final[0].isolatedPath,
        title: "final version",
        css: mq({
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: ['flex-start', 'center'],
          color: 'inherit',
          padding: ['.7rem 1rem', 0],
          height: [48, 56],
          fontSize: 16,
          textDecoration: 'none',
          borderRadius: 5,
          ':hover': {
            background: theme.backgroundLight,
            svg: {
              fill: theme.primary
            }
          }
        })
      }, jsx(RiFlagLine, {
        size: "18",
        color: theme.textLightest,
        css: {
          marginRight: 5
        }
      }), jsx("span", null, "Final Version"))));
    }))));
  }
  Home.displayName = 'Home';
  function NotFound() {
    const theme = useTheme$1();
    return jsx("div", {
      css: {
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }
    }, jsx("div", null, jsx(Logo, {
      size: 120,
      color: theme.skyDark,
      strokeWidth: 0.7,
      css: {
        opacity: 0.7
      }
    }), jsx("h1", null, `Sorry... nothing here.`), `To open one of the exercises, go to `, jsx("code", null, `/exerciseNumber`), `, for example: `, jsx(Link, {
      to: "/1"
    }, jsx("code", null, `/1`)), jsx("div", {
      css: {
        marginTop: '2rem',
        a: {
          textDecoration: 'none'
        }
      }
    }, jsx(Link, {
      to: "/",
      css: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, jsx(RiArrowLeftSLine, null), "Back home"))));
  }
  NotFound.displayName = 'NotFound';
  function useDarkMode() {
    const preferDarkQuery = '(prefers-color-scheme: dark)';
    const [mode, setMode] = React.useState(() => {
      const lsVal = window.localStorage.getItem('colorMode');
      if (lsVal) {
        return lsVal === 'dark' ? 'dark' : 'light';
      } else {
        return window.matchMedia(preferDarkQuery).matches ? 'dark' : 'light';
      }
    });
    React.useEffect(() => {
      const mediaQuery = window.matchMedia(preferDarkQuery);
      const handleChange = () => {
        setMode(mediaQuery.matches ? 'dark' : 'light');
      };
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }, []);
    React.useEffect(() => {
      window.localStorage.setItem('colorMode', mode);
    }, [mode]);

    // we're doing it this way instead of as an effect so we only
    // set the localStorage value if they explicitly change the default
    return [mode, setMode];
  }
  function DelayedTransition() {
    // we have it this way so dark mode is rendered immediately rather than
    // transitioning to it on initial page load.
    const [renderStyles, setRender] = React.useState(false);
    React.useEffect(() => {
      const timeout = setTimeout(() => {
        setRender(true);
      }, 450);
      return () => clearTimeout(timeout);
    }, []);
    return renderStyles ? jsx(Global, {
      styles: {
        '*, *::before, *::after': {
          // for the theme change
          transition: `background 0.4s, background-color 0.4s, border-color 0.4s`
        }
      }
    }) : null;
  }
  function App() {
    const [mode, setMode] = useDarkMode();
    const theme$1 = theme(mode);
    React.useLayoutEffect(() => {
      var _document$getElementB;
      (_document$getElementB = document.getElementById('root')) == null || _document$getElementB.classList.add('react-workshop-app');
    });
    return jsx(ThemeProvider, {
      theme: theme$1
    }, jsx(Router, {
      history: history
    }, jsx(Switch, null, jsx(Route, {
      exact: true,
      path: "/"
    }, jsx(Home, {
      mode: mode,
      setMode: setMode
    })), jsx(Route, {
      exact: true,
      path: "/:exerciseNumber(\\d+)"
    }, jsx(ExerciseContainer, {
      mode: mode,
      setMode: setMode
    })), jsx(Route, null, jsx(NotFound, null)))), jsx(Global, {
      styles: {
        'html, body, #root': {
          background: theme$1.background,
          color: theme$1.text
        },
        '::selection': {
          background: theme$1.primary,
          color: 'white'
        },
        '[data-reach-tab]': {
          cursor: 'pointer'
        },
        a: {
          color: theme$1.primary
        },
        /*
          This will hide the focus indicator if the element receives focus via the mouse,
          but it will still show up on keyboard focus.
        */
        '*:focus:not(:focus-visible)': {
          outline: 'none'
        },
        hr: {
          background: theme$1.textLightest
        }
      }
    }), jsx(Global, {
      styles: `
              ${mode === 'light' ? prismThemeLight : prismThemeDark}
            `
    }), jsx(DelayedTransition, null));
  }
  function ErrorFallback({
    error,
    resetErrorBoundary
  }) {
    return jsx("div", {
      css: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: '50px'
      }
    }, jsx("p", null, "Oh no! Something went wrong!"), jsx("div", null, jsx("p", null, `Here's the error:`), jsx("pre", {
      css: {
        color: 'red',
        overflowY: 'scroll'
      }
    }, error.message)), jsx("div", null, jsx("p", null, "Try doing one of these things to fix this:"), jsx("ol", null, jsx("li", null, jsx("button", {
      onClick: resetErrorBoundary
    }, "Rerender the app")), jsx("li", null, jsx("button", {
      onClick: () => window.location.reload()
    }, "Refresh the page")), jsx("li", null, "Update your code to fix the problem"))));
  }
  render(jsx(ErrorBoundary, {
    FallbackComponent: ErrorFallback
  }, jsx(App, null)));
}

/*
eslint
  max-statements: "off",
  @typescript-eslint/no-non-null-assertion: "off"
*/

const styleTag = document.createElement('style');
const requiredStyles = ["/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */html{line-height:1.15;-webkit-text-size-adjust:100%}body{margin:0}main{display:block}h1{font-size:2em;margin:.67em 0}hr{box-sizing:initial;height:0;overflow:visible}pre{font-family:monospace,monospace;font-size:1em}a{background-color:initial}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}b,strong{font-weight:bolder}code,kbd,samp{font-family:monospace,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:initial}sub{bottom:-.25em}sup{top:-.5em}img{border-style:none}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0}button,input{overflow:visible}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring,button:-moz-focusring{outline:1px dotted ButtonText}fieldset{padding:.35em .75em .625em}legend{box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal}progress{vertical-align:initial}textarea{overflow:auto}[type=checkbox],[type=radio]{box-sizing:border-box;padding:0}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}details{display:block}summary{display:list-item}[hidden],template{display:none}", "body{font-family:Century Gothic,Futura,sans-serif}*,:after,:before{box-sizing:border-box}hr{opacity:.5;border:none;height:1px;max-width:100%;margin-top:30px;margin-bottom:30px}",
// this will happen when running the regular app and embedding the example
// in an iframe.
// pretty sure the types are wrong on this one... (It's been fixed in TS 4.2)
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
window.frameElement ? `#root{display:grid;place-items:center;height:100vh;}` : ''].join('\n');
styleTag.appendChild(document.createTextNode(requiredStyles));
document.head.prepend(styleTag);
const fillScreenCenter = `padding:30px;min-height:100vh;display:grid;align-items:center;justify-content:center;`;
const originalDocumentElement = document.documentElement;
let unmount;
function makeKCDWorkshopApp({
  imports,
  filesInfo,
  projectTitle,
  backend,
  ...otherWorkshopOptions
}) {
  const lazyComponents = {};
  const componentExtensions = ['.js', '.md', '.mdx', '.tsx', '.ts'];
  for (const {
    ext,
    filePath
  } of filesInfo) {
    if (componentExtensions.includes(ext)) {
      lazyComponents[filePath] = /*#__PURE__*/React.lazy(moduleWithDefaultExport(imports, filePath));
    }
  }
  if (backend) {
    const {
      handlers,
      quiet = true,
      serviceWorker = {
        url: '/mockServiceWorker.js'
      },
      ...rest
    } = backend;
    if (process.env.NODE_ENV !== 'test') {
      const server = setup({
        handlers
      });
      void server.start({
        quiet,
        serviceWorker,
        ...rest
      });
    }
  }
  const history = createBrowserHistory();
  let previousLocation = history.location;
  let previousIsIsolated = null;
  function render(ui) {
    const rootEl = document.getElementById('root');
    if (rootEl) {
      unmount == null || unmount(rootEl);
    } else {
      // eslint-disable-next-line no-alert
      window.alert('This document has no div with the ID of "root." Please add one... Or bug Kent about it...');
      return;
    }
    const root = createRoot(rootEl);
    root.render(ui);
    unmount = () => root.unmount();
  }
  function escapeForClassList(name) {
    // classList methods don't allow space or `/` characters
    return encodeURIComponent(name.replace(/\//g, '_'));
  }
  function handleLocationChange(location = history.location) {
    const {
      pathname
    } = location;
    // add location pathname to classList of the body
    // avoid the dev-tools flash of update by not updating the class name unecessarily
    const prevClassName = escapeForClassList(previousLocation.pathname);
    const newClassName = escapeForClassList(pathname);
    if (document.body.classList.contains(prevClassName)) {
      document.body.classList.remove(escapeForClassList(previousLocation.pathname));
    }
    if (!document.body.classList.contains(newClassName)) {
      document.body.classList.add(escapeForClassList(pathname));
    }

    // set the title to have info for the exercise
    const isIsolated = pathname.startsWith('/isolated');
    let info;
    if (isIsolated) {
      const filePath = pathname.replace('/isolated', 'src');
      info = filesInfo.find(i => i.filePath === filePath);
    } else {
      const number = Number(pathname.split('/').slice(-1)[0]);
      info = filesInfo.find(i => i.type === 'instruction' && i.number === number);
    }
    if (isIsolated && !info) {
      document.body.innerHTML = `
        <div style="${fillScreenCenter}">
          <div>
            Sorry... nothing here. To open one of the exercises, go to
            <code>\`/exerciseNumber\`</code>, for example:
            <a href="/1"><code>/1</code></a>
          </div>
        </div>
      `;
      return;
    }

    // I honestly have no clue why, but there appears to be some kind of
    // race condition here with the title. It seems to get reset to the
    // title that's defined in the index.html after we set it :shrugs:
    setTimeout(() => {
      const title = [info ? [info.number ? `${info.number}. ` : '', info.title || info.filename].join('') : null, projectTitle].filter(Boolean).join(' | ');
      // the dev-tools flash the title as changed on HMR even
      // if it's not actually changed, so we'll only change it
      // when it's necessary:
      if (document.title !== title) {
        document.title = title;
      }
    }, 20);
    if (isIsolated && info) {
      renderIsolated(moduleWithDefaultExport(imports, info.filePath));
    } else if (previousIsIsolated !== isIsolated) {
      // if we aren't going from isolated to the app, then we don't need
      // to bother rendering react anew. The app will handle that.
      renderReact();
    }
    previousLocation = location;
    previousIsIsolated = isIsolated;
  }
  function renderIsolated(isolatedModuleImport) {
    void isolatedModuleImport().then(async ({
      default: defaultExport
    }) => {
      if (history.location !== previousLocation) {
        // location has changed while we were getting the module
        // so don't bother doing anything... Let the next event handler
        // deal with it
        return;
      }
      if (typeof defaultExport === 'function') {
        if (defaultExport === DO_NOT_RENDER) {
          return;
        }
        // regular react component.
        render( /*#__PURE__*/React.createElement(defaultExport));
      } else if (typeof defaultExport === 'string') {
        // HTML file
        const domParser = new DOMParser();
        const newDocument = domParser.parseFromString(defaultExport, 'text/html');
        document.documentElement.replaceWith(newDocument.documentElement);

        // to get all the scripts to actually run, you have to create new script
        // elements, and no, cloneElement doesn't work unfortunately.
        // Apparently, scripts will only get loaded/run if you use createElement.
        const scripts = Array.from(document.querySelectorAll('script'));
        const loadingScriptsQueue = [];
        for (const script of scripts) {
          var _script$parentNode, _script$parentNode2;
          // if we're dealing with an inline script, we need to wait for all other
          // scripts to finish loading before we run it
          if (!script.hasAttribute('src')) {
            // eslint-disable-next-line no-await-in-loop
            await Promise.all(loadingScriptsQueue);
          }
          // replace the script
          const newScript = document.createElement('script');
          for (const attrName of script.getAttributeNames()) {
            var _script$getAttribute;
            newScript.setAttribute(attrName, (_script$getAttribute = script.getAttribute(attrName)) != null ? _script$getAttribute : '');
          }
          newScript.innerHTML = script.innerHTML;
          (_script$parentNode = script.parentNode) == null || _script$parentNode.insertBefore(newScript, script);
          (_script$parentNode2 = script.parentNode) == null || _script$parentNode2.removeChild(script);

          // if the new script has a src, add it to the queue
          if (script.hasAttribute('src')) {
            loadingScriptsQueue.push(new Promise(resolve => {
              newScript.onload = resolve;
            }));
          }
        }

        // now make sure all src scripts are loaded before continuing
        await Promise.all(loadingScriptsQueue);

        // Babel will call this when the DOMContentLoaded event fires
        // but because the content has already loaded, that event will never
        // fire, so we'll run it ourselves
        if (window.Babel) {
          window.Babel.transformScriptTags();
        }
      }

      // otherwise we'll just expect that the file ran the thing it was supposed
      // to run and doesn't need any help.
    });
  }
  function renderReact() {
    if (document.documentElement !== originalDocumentElement) {
      document.documentElement.replaceWith(originalDocumentElement);
    }
    renderReactApp({
      history,
      projectTitle,
      filesInfo,
      lazyComponents,
      render,
      ...otherWorkshopOptions
    });
  }
  history.listen(handleLocationChange);
  // kick it off to get us started
  handleLocationChange();
}

// React.lazy *requires* that you pass it a promise that resolves to a default export
// of a function that returns JSX.Element. But we want to be able to dynamically
// import a function that we don't actually render (because that file will render itself manually)
// so we use this as the fallback for that situation and explicitely do not bother rendering it
function DO_NOT_RENDER() {
  return /*#__PURE__*/React.createElement(React.Fragment, null);
}
function moduleWithDefaultExport(imports, filePath) {
  const importFn = imports[filePath];
  if (!importFn) throw new Error(`'${filePath}' does not exist in imports.`);
  if (filePath.endsWith('html')) {
    return importFn;
  }
  return function importJS() {
    return importFn().then(module => {
      var _ref, _module$App;
      if (filePath.match(/\.mdx?$/)) targetBlankifyInstructionLinks();
      return {
        default: (_ref = (_module$App = module.App) != null ? _module$App : module.default) != null ? _ref : DO_NOT_RENDER
      };
    }, error => {
      console.error('Error importing a JS file', filePath, error);
      return {
        default: () => /*#__PURE__*/React.createElement("div", null, error.message)
      };
    });
  };
}

// this is a pain, but we need to add target="_blank" to all the links
// in the markdown and even though I tried with useEffect, I couldn't
// get my useEffect to run *after* the markdown was rendered, so we're
// pulling this hack together 🙄
function targetBlankifyInstructionLinks() {
  setTimeout(() => {
    const instructionContainer = document.querySelector('.instruction-container');
    // this shouldn't happen, but it could...
    if (!instructionContainer) return;
    const anchors = Array.from(instructionContainer.querySelectorAll('a'));
    for (const anchor of anchors) {
      anchor.setAttribute('target', '_blank');
      anchor.setAttribute('rel', 'noopener noreferrer nofollow');
    }
  }, 200);
}

/*
eslint
  babel/no-unused-expressions: "off",
  @typescript-eslint/no-explicit-any: "off",
  @typescript-eslint/prefer-regexp-exec: "off",
  react/jsx-no-useless-fragment: "off",
  no-void: "off"
*/

export { makeKCDWorkshopApp };
