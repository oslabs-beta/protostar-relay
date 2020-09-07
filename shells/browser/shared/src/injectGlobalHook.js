/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

/* global chrome */

import nullthrows from 'nullthrows';
import { installHook } from 'src/hook';

function injectCode(code) {
  const script = document.createElement('script');
  script.textContent = code;

  // This script runs before the <head> element is created,
  // so we add the script to <html> instead.
  nullthrows(document.documentElement).appendChild(script);
  nullthrows(script.parentNode).removeChild(script);
}

let lastDetectionResult;

// We want to detect when a renderer attaches, and notify the "background page"
// (which is shared between tabs and can highlight the React icon).
// Currently we are in "content script" context, so we can't listen to the hook directly
// (it will be injected directly into the page).
// So instead, the hook will use postMessage() to pass message to us here.
// And when this happens, we'll send a message to the "background page".
window.addEventListener('message', function(evt) {
  if (
    evt.source === window &&
    evt.data &&
    evt.data.source === 'relay-devtools-detector'
  ) {
    lastDetectionResult = {
      hasDetectedReact: true,
    };
    chrome.runtime.sendMessage(lastDetectionResult);
  }
});

// NOTE: Firefox WebExtensions content scripts are still alive and not re-injected
// while navigating the history to a document that has not been destroyed yet,
// replay the last detection result if the content script is active and the
// document has been hidden and shown again.
window.addEventListener('pageshow', function(evt) {
  if (!lastDetectionResult || evt.target !== window.document) {
    return;
  }
  chrome.runtime.sendMessage(lastDetectionResult);
});

const detectRelay = `
window.__RELAY_DEVTOOLS_HOOK__.on('environment', function(evt) {
  window.postMessage({
    source: 'relay-devtools-detector',
  }, '*');
});
`;

// Inject a `__RELAY_DEVTOOLS_HOOK__` global so that Relay can detect that the
// devtools are installed (and skip its suggestion to install the devtools).
injectCode(';(' + installHook.toString() + '(window))' + detectRelay);
