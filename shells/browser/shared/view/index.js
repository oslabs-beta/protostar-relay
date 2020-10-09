/** @format */

import React from 'react';
import { render } from 'react-dom';

import App from './App.jsx';
import styles from './styles.scss';

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Portal target container.
window.container = document.getElementById('container');

let hasInjectedStyles = false;

// DevTools styles are injected into the top-level document head (where the main React app is rendered).
// This method copies those styles to the child window where each panel (e.g. Elements, Profiler) is portaled.
window.injectStyles = getLinkTags => {
  if (!hasInjectedStyles) {
    hasInjectedStyles = true;

    const linkTags = getLinkTags();

    for (const linkTag of linkTags) {
      document.head.appendChild(linkTag);
    }
  }
};

render(<App />, document.getElementById('root'));
