"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeKCDWorkshopApp = makeKCDWorkshopApp;
var _react = _interopRequireDefault(require("react"));
var _client = require("react-dom/client");
var _history = require("history");
var _server = require("./server");
var _reactApp = require("./react-app");
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
      lazyComponents[filePath] = /*#__PURE__*/_react.default.lazy(moduleWithDefaultExport(imports, filePath));
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
      const server = (0, _server.setup)({
        handlers
      });
      void server.start({
        quiet,
        serviceWorker,
        ...rest
      });
    }
  }
  const history = (0, _history.createBrowserHistory)();
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
    const root = (0, _client.createRoot)(rootEl);
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
        render( /*#__PURE__*/_react.default.createElement(defaultExport));
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
    (0, _reactApp.renderReactApp)({
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
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null);
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
        default: () => /*#__PURE__*/_react.default.createElement("div", null, error.message)
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