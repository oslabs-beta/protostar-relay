/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* global chrome */

export function createViewElementSource(bridge: Bridge, store: Store) {
  return function viewElementSource(id) {
    const rendererID = store.getRendererIDForElement(id);
    if (rendererID != null) {
      // Ask the renderer interface to determine the component function,
      // and store it as a global variable on the window
      bridge.send('viewElementSource', { id, rendererID });

      setTimeout(() => {
        // Ask Chrome to display the location of the component function,
        // assuming the renderer found one.
        chrome.devtools.inspectedWindow.eval(`
          if (window.$type != null) {
            inspect(window.$type);
          }
        `);
      }, 100);
    }
  };
}
