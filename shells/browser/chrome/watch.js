#!/usr/bin/env node
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { execSync } = require('child_process');
const { join } = require('path');


const webpackPath = join(
  __dirname,
  '..',
  '..',
  '..',
  'node_modules',
  '.bin',
  'webpack'
);
const binPath = join(__dirname, 'build', 'unpacked', 'build');
execSync(
  `${webpackPath} --config ../shared/webpack.config.js --output-path ${binPath} --watch`,
  {
    cwd: join(__dirname, '..', 'shared'),
    env: process.env,
    stdio: 'inherit',
  }
);
