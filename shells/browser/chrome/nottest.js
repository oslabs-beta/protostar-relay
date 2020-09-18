#!/usr/bin/env node
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const chromeLaunch = require('chrome-launch'); // eslint-disable-line import/no-extraneous-dependencies
const { resolve } = require('path');

const EXTENSION_PATH = resolve('shells/browser/chrome/build/unpacked');
const START_URL = 'https://facebook.github.io/react/';

chromeLaunch(START_URL, {
  args: [`--load-extension=${EXTENSION_PATH}`],
});
