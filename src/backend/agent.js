/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import EventEmitter from 'events';
import type { BackendBridge } from 'src/bridge';

import type { EnvironmentID, EnvironmentWrapper } from './types';

export default class Agent extends EventEmitter<{|
  shutdown: [],
  refreshStore: [],
|}> {
  _bridge: BackendBridge;
  _recordChangeDescriptions: boolean = false;
  _environmentWrappers: {
    [key: EnvironmentID]: EnvironmentWrapper,
  } = {};

  constructor(bridge: BackendBridge) {
    super();

    this._bridge = bridge;

    bridge.addListener('shutdown', this.shutdown);
    bridge.addListener('refreshStore', this.refreshStore);
  }

  get environmentWrappers(): {
    [key: EnvironmentID]: EnvironmentWrapper,
  } {
    return this._environmentWrappers;
  }

  shutdown = () => {
    // Clean up the overlay if visible, and associated events.
    this.emit('shutdown');
  };

  refreshStore = (id: EnvironmentID) => {
    const wrapper = this._environmentWrappers[id];
    wrapper && wrapper.sendStoreRecords();
  };

  onEnvironmentInitialized = (data: mixed) => {
    this._bridge.send('environmentInitialized', [data]);
  };

  setEnvironmentWrapper = (
    id: number,
    environmentWrapper: EnvironmentWrapper
  ) => {
    this._environmentWrappers[id] = environmentWrapper;
  };

  onStoreData = (data: mixed) => {
    this._bridge.send('storeRecords', [data]);
  };

  onEnvironmentEvent = (data: mixed) => {
    this._bridge.send('events', [data]);
  };
}
