/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* global chrome */

export default function inject(scriptName: string, done: ?Function) {
  const source = `
  // the prototype stuff is in case document.createElement has been modified
  (function () {
    var script = document.constructor.prototype.createElement.call(document, 'script');
    script.src = "${scriptName}";
    script.charset = "utf-8";
    document.documentElement.appendChild(script);
    script.parentNode.removeChild(script);
  })()
  `;

  chrome.devtools.inspectedWindow.eval(source, function(response, error) {
    if (error) {
      console.log(error);
    }

    if (typeof done === 'function') {
      done();
    }
  });
}
