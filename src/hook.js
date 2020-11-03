/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

/**
 * Install the hook on window, which is an event emitter.
 * Note because Chrome content scripts cannot directly modify the window object,
 * we are evaling this function by inserting a script tag.
 * That's why we have to inline the whole event emitter implementation here.
 */

import type { DevToolsHook } from 'src/backend/types';

declare var window: any;

export function installHook(target: any): DevToolsHook | null {
  if (target.hasOwnProperty('__RELAY_DEVTOOLS_HOOK__')) {
    return null;
  }
  const listeners = {};
  const environments = new Map();

  let uidCounter = 0;

  function registerEnvironment(environment) {
    const id = ++uidCounter;
    environments.set(id, environment);

    hook.emit('environment', { id, environment });

    return id;
  }

  function sub(event, fn) {
    hook.on(event, fn);
    return () => hook.off(event, fn);
  }

  function on(event, fn) {
    if (!listeners[event]) {
      listeners[event] = [];
    }
    listeners[event].push(fn);
  }

  function off(event, fn) {
    if (!listeners[event]) {
      return;
    }
    const index = listeners[event].indexOf(fn);
    if (index !== -1) {
      listeners[event].splice(index, 1);
    }
    if (!listeners[event].length) {
      delete listeners[event];
    }
  }

  function emit(event, data) {
    if (listeners[event]) {
      listeners[event].map(fn => fn(data));
    }
  }

  const environmentWrappers = new Map();

  const hook: DevToolsHook = {
    registerEnvironment,
    environmentWrappers,
    // listeners,
    environments,

    emit,
    // inject,
    on,
    off,
    sub
  };

  Object.defineProperty(
    target,
    '__RELAY_DEVTOOLS_HOOK__',
    ({
      // This property needs to be configurable for the test environment,
      // else we won't be able to delete and recreate it beween tests.
      configurable: __DEV__,
      enumerable: false,
      get() {
        return hook;
      }
    }: Object)
  );

  return hook;
}
