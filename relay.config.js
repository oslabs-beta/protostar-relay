/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  src: './shells/dev/relay-app',
  schema: './shells/dev/relay-app/schema.graphql',
  watchman: false,
  watch: false,
  exclude: ['**/node_modules/**', '**/__generated__/**'],
};
