/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { resolve } = require('path');
const { DefinePlugin } = require('webpack');
const {
  getGitHubIssuesURL,
  getGitHubURL,
  getInternalDevToolsFeedbackGroup,
  getVersionString
} = require('../../utils');

const NODE_ENV = process.env.NODE_ENV;
if (!NODE_ENV) {
  console.error('NODE_ENV not set');
  process.exit(1);
}

const __DEV__ = NODE_ENV === 'development';

const GITHUB_URL = getGitHubURL();
const DEVTOOLS_VERSION = getVersionString();
const GITHUB_ISSUES_URL = getGitHubIssuesURL();
const DEVTOOLS_FEEDBACK_GROUP = getInternalDevToolsFeedbackGroup();

module.exports = {
  mode: __DEV__ ? 'development' : 'production',
  devtool: __DEV__ ? 'cheap-module-eval-source-map' : false,
  entry: {
    background: './src/background.js',
    contentScript: './src/contentScript.js',
    injectGlobalHook: './src/injectGlobalHook.js',
    index: './view/index.js',
    main: './src/main.js'
  },
  output: {
    path: __dirname + '/build',
    filename: '[name].js'
  },
  resolve: {
    alias: {
      src: resolve(__dirname, '../../../src')
    }
  },
  plugins: [
    new DefinePlugin({
      __DEV__: false,
      'process.env.DEVTOOLS_VERSION': `"${DEVTOOLS_VERSION}"`,
      'process.env.GITHUB_URL': `"${GITHUB_URL}"`,
      'process.env.GITHUB_ISSUES_URL': `"${GITHUB_ISSUES_URL}"`,
      'process.env.DEVTOOLS_FEEDBACK_GROUP': `"${DEVTOOLS_FEEDBACK_GROUP}"`
    })
  ],
  module: {
    rules: [
      {
        test: /.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          configFile: resolve(__dirname, '../../../babel.config.js')
        }
      },
      {
        test: /.(css|scss)$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  }
};
