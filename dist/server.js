"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  setup: true,
  server: true
};
exports.server = void 0;
exports.setup = setup;
var _nodeMatchPath = require("node-match-path");
var _msw = require("msw");
Object.keys(_msw).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _msw[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _msw[key];
    }
  });
});
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
const server = exports.server = {};
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
    return (requestMethod === 'ALL' || req.method === requestMethod) && (0, _nodeMatchPath.match)(urlMatch, req.url.pathname).matches;
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