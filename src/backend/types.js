/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

export type EnvironmentID = number;

export type RelayRecordSource = {
  getRecordIDs: () => string,
  get: (id: string) => any,
  toJSON: () => any
};

export type RelayStore = {
  getSource: () => RelayRecordSource,
  __log: (event: Object) => void
};

export type RelayEnvironment = {
  execute: (options: any) => any,
  configName: ?string,
  getStore: () => RelayStore,
  __log: (event: Object) => void
};

export type EnvironmentWrapper = {
  flushInitialOperations: () => void,
  sendStoreRecords: () => void,
  cleanup: () => void
};

export type Handler = (data: any) => void;

export type DevToolsHook = {
  registerEnvironment: (env: RelayEnvironment) => number | null,
  // listeners: { [key: string]: Array<Handler> },
  environmentWrappers: Map<EnvironmentID, EnvironmentWrapper>,
  environments: Map<EnvironmentID, RelayEnvironment>,

  emit: (event: string, data: any) => void,
  on: (event: string, handler: Handler) => void,
  off: (event: string, handler: Handler) => void,
  // reactDevtoolsAgent?: ?Object,
  sub: (event: string, handler: Handler) => () => void
};
