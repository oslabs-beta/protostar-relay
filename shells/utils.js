/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { execSync } = require('child_process');
const { readFileSync, existsSync } = require('fs');
const { resolve } = require('path');

function getCommit() {
  if (existsSync(resolve(__dirname, '../.git'))) {
    return execSync('git show -s --format=%h')
      .toString()
      .trim();
  }
  return execSync('hg id -i')
    .toString()
    .trim();
}

function getGitHubURL() {
  return 'https://github.com/relayjs/relay-devtools';
}

function getGitHubIssuesURL() {
  return 'https://github.com/relayjs/relay-devtools/issues/new';
}

function getInternalDevToolsFeedbackGroup() {
  return 'https://fburl.com/ieftwi8l';
}

function getVersionString() {
  const packageVersion = JSON.parse(
    readFileSync(resolve(__dirname, '../package.json'))
  ).version;

  const commit = getCommit();

  return `${packageVersion}-${commit}`;
}

module.exports = {
  getCommit,
  getGitHubIssuesURL,
  getGitHubURL,
  getInternalDevToolsFeedbackGroup,
  getVersionString,
};
