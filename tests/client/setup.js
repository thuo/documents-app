import { jsdom } from 'jsdom';

function requireUncached(module) {
  /* eslint-disable global-require */
  delete require.cache[require.resolve(module)];
  return require(module);
}

global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = global.window.navigator;
global.Element = global.window.Element;
global.Event = global.window.Event;

requireUncached('react-mdl/extra/material');
